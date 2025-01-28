const Container = ReactBootstrap.Container;
const Badge = ReactBootstrap.Badge;

import MailSidebar from './mail-sidebar';
import Inbox from './inbox';
import ComposeEmail from './compose-email';
import ViewEmail from './view-email';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            screen: "inbox",
            currentEmailId: null
        }

        this.setScreen = this.setScreen.bind(this);
        this.setCurrentEmailId = this.setCurrentEmailId.bind(this);
    }

    componentDidMount() {
        fetch("/user", {
            "method": 'GET',
            "credentials": 'include',
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(user => this.setState({ user }),
                error => console.log(error.message));
    }

    setScreen(screen) {
        this.setState({ screen });
    }

    setCurrentEmailId(currentEmailId) {
        this.setState({ currentEmailId });
    }

    render() {
        const { screen, user, currentEmailId } = this.state;
        let screenToShow;
        switch (screen) {
            case "view":
                screenToShow = <ViewEmail type={screen} user={user} currentEmailId={currentEmailId}
                    setScreen={this.setScreen} setCurrentEmailId={this.setCurrentEmailId}></ViewEmail>;
                break;
            case "compose":
            case "reply":
                screenToShow = <ComposeEmail type={screen} user={user} currentEmailId={currentEmailId}
                    setScreen={this.setScreen} setCurrentEmailId={this.setCurrentEmailId}></ComposeEmail>;
                break;
            default:
                screenToShow = <Inbox type={screen} currentEmailId={currentEmailId} setScreen={this.setScreen}
                    setCurrentEmailId={this.setCurrentEmailId}></Inbox>;
                break;
        }

        return (
            <div className="d-flex vh-100">
                <MailSidebar user={user} setScreen={this.setScreen}></MailSidebar>
                <Container fluid className="m-4">
                    <h1 className="text-center mb-5">
                        <Badge pill variant="dark" className="bg-marine shadow">
                            {screen.toUpperCase()}
                        </Badge>
                    </h1>
                    {screenToShow}
                </Container>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector("#react-app"));
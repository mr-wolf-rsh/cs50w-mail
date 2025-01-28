const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const Dropdown = ReactBootstrap.Dropdown;
const OverlayTrigger = ReactBootstrap.OverlayTrigger;
const Tooltip = ReactBootstrap.Tooltip;
const Spinner = ReactBootstrap.Spinner;

export default class MailSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return (
                <div className="m-auto" style={{ "width": "fit-content" }}>
                    <Spinner animation="grow" variant="dark" />
                </div>
            )
        }

        return (
            <Navbar variant="dark" expand="lg"
                className="flex-column bg-marine shadow">
                <Nav className="p-3 flex-column justify-content-around h-100">
                    <Nav.Item>
                        <Navbar.Brand>
                            <i className="material-icons-round icon-mail brand text-light">email</i>
                            <span>
                                Mail
                            </span>
                        </Navbar.Brand>
                    </Nav.Item>
                    <Dropdown as={Nav.Item} drop="right">
                        <Dropdown.Toggle as={Nav.Link} className="mx-auto" style={{ 'width': 'fit-content' }}>
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip>
                                        <strong>User</strong>
                                    </Tooltip>
                                }>
                                <i className="material-icons-round icon-mail">account_circle</i>
                            </OverlayTrigger>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header><strong>{user.first_name} {user.last_name}</strong></Dropdown.Header>
                            <Dropdown.Header><strong>{user.email}</strong></Dropdown.Header>
                            <Dropdown.Divider />
                            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Item>
                        <Nav.Link onClick={_ => this.props.setScreen('compose')} className="mx-auto" style={{ 'width': 'fit-content' }}>
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip>
                                        <strong>Compose</strong>
                                    </Tooltip>
                                }>
                                <i className="material-icons-round icon-mail">add_circle_outline</i>
                            </OverlayTrigger>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={_ => this.props.setScreen('inbox')} className="mx-auto" style={{ 'width': 'fit-content' }}>
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip>
                                        <strong>Inbox</strong>
                                    </Tooltip>
                                }>
                                <i className="material-icons-round icon-mail">inbox</i>
                            </OverlayTrigger>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={_ => this.props.setScreen('sent')} className="mx-auto" style={{ 'width': 'fit-content' }}>
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip>
                                        <strong>Sent</strong>
                                    </Tooltip>
                                }>
                                <i className="material-icons-round icon-mail">send</i>
                            </OverlayTrigger>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={_ => this.props.setScreen('archive')} className="mx-auto" style={{ 'width': 'fit-content' }}>
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip>
                                        <strong>Archived</strong>
                                    </Tooltip>
                                }>
                                <i className="material-icons-round icon-mail">archive</i>
                            </OverlayTrigger>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        );
    }
}
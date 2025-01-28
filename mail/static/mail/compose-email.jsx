const Spinner = ReactBootstrap.Spinner;
const Card = ReactBootstrap.Card;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Form = ReactBootstrap.Form;
const Button = ReactBootstrap.Button;

const initialState = {
    recipients: [],
    subject: '',
    body: '',
    recipientOptions: []
};

export default class ComposeEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    componentDidMount() {
        this.getRecipients();
        if (this.props.currentEmailId) {
            this.getEmail(this.props.currentEmailId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            this.setState(initialState);
            this.getRecipients();
        }
    }

    handleChangeSelect(newValue, _) {
        this.setState({ recipients: newValue })
    }

    getRecipients() {
        fetch("/recipients", {
            "method": 'GET',
            "credentials": 'include',
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(recipients => {
                const recipientOptions = this.formatRecipientOptions(recipients);
                this.setState({ recipientOptions });
            }, error => console.log(error.message));
    }

    getEmail(emailId) {
        fetch(`/emails/${emailId}`, {
            "method": 'GET',
            "credentials": 'include',
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(email => {
                this.props.setCurrentEmailId(null);
                this.setState({
                    recipients: this.formatRecipientOptions([email.sender]),
                    subject: `Re: ${email.subject.replace('Re: ', '')}`,
                    body: `\n\nOn ${email.timestamp} ${email.sender.email} wrote:\n\n${email.body}`
                });
            }, error => console.log(error.message));
    }

    sendEmail() {
        const { recipients, subject, body } = this.state;
        fetch("/emails", {
            "method": 'POST',
            "credentials": 'include',
            "body": JSON.stringify({
                recipients: recipients.map(option => option.value).join(','),
                subject: subject,
                body: body
            }),
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(_ => this.props.setScreen('sent'),
                error => console.log(error.message));
    }

    handleChange(event, formControl) {
        this.setState({
            [formControl]: event.target.value
        });
    }

    handleButton() {
        this.sendEmail();
    }

    render() {
        const { user } = this.props;
        const { recipients, subject, body, recipientOptions } = this.state;

        if (!user) {
            return (
                <div className="m-auto" style={{ "width": "fit-content" }}>
                    <Spinner animation="grow" variant="dark" />
                </div>
            );
        }

        return (
            <Card className="mx-auto text-center mt-4 mx-4">
                <Card.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2" className="text-left">
                            From:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control className="text-center" plaintext readOnly defaultValue={user.email} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2" className="text-left">
                            To:
                        </Form.Label>
                        <Col sm="10">
                            <Select.Creatable isMulti onChange={this.handleChangeSelect} placeholder=""
                                options={recipientOptions} value={recipients} autoFocus />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2" className="text-left">
                            Subject:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={e => this.handleChange(e, 'subject')} value={subject} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2" className="text-left">
                            Body:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={e => this.handleChange(e, 'body')} as="textarea" rows="8" value={body} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }} >
                            <Button onClick={this.handleButton} variant="secondary" size="block">Send</Button>
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
        );
    }

    formatRecipientOptions(recipients) {
        return recipients.map(user => {
            return {
                value: user.email,
                label: `${user.first_name} ${user.last_name}`
            };
        });
    }
}
const Spinner = ReactBootstrap.Spinner;
const Card = ReactBootstrap.Card;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Form = ReactBootstrap.Form;
const OverlayTrigger = ReactBootstrap.OverlayTrigger;
const Tooltip = ReactBootstrap.Tooltip;

export default class ViewEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null
        };

        this.handleReadArchiveButton = this.handleReadArchiveButton.bind(this);
        this.handleReplyButton = this.handleReplyButton.bind(this);
    }

    componentDidMount() {
        this.getEmail(this.props.currentEmailId);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => { return; };
    }

    handleReplyButton(e, emailId) {
        e.stopPropagation();
        this.props.setCurrentEmailId(emailId);
        this.props.setScreen('reply');
    }

    handleReadArchiveButton(e, email, option) {
        e.stopPropagation();
        this.updateReadArchive(email, option);
        this.props.setScreen('inbox');
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
                this.setState({ email });
            }, error => console.log(error.message));
    }

    updateReadArchive(email, option) {
        const update = { [option]: !email[option] };
        fetch(`/emails/${email.id}`, {
            "method": 'PUT',
            "credentials": 'include',
            "body": JSON.stringify(update),
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(_ => this.setState({
                email: Object.assign(this.state.email, update)
            }),
                error => console.log(error.message));
    }

    render() {
        const { user } = this.props;
        const { email } = this.state;

        if (!user || !email) {
            return (
                <div className="m-auto" style={{ "width": "fit-content" }}>
                    <Spinner animation="grow" variant="dark" />
                </div>
            );
        }

        return (
            <Card className="mx-auto text-center mt-4 mx-4">
                <Card.Header>
                    <Row>
                        <Col sm={{ span: 3, offset: 9 }}>
                            <div className="d-flex justify-content-around">
                                <a className="table-link" onClick={e => this.handleReplyButton(e, email.id)}>
                                    <OverlayTrigger placement="top"
                                        overlay={
                                            <Tooltip>
                                                Reply
                                            </Tooltip>
                                        }>
                                        <i className="material-icons-round icon-mail sm">reply</i>
                                    </OverlayTrigger>
                                </a>
                                <a className="table-link" onClick={e =>
                                    this.handleReadArchiveButton(e, email, 'read')}>
                                    {
                                        (email.read) ?
                                            <OverlayTrigger placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        Mark as unread
                                                    </Tooltip>
                                                }>
                                                <i className="material-icons-round icon-mail sm">mark_email_unread</i>
                                            </OverlayTrigger> :
                                            <OverlayTrigger placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        Mark as read
                                                    </Tooltip>
                                                }>
                                                <i className="material-icons-round icon-mail sm">mark_email_read</i>
                                            </OverlayTrigger>
                                    }
                                </a>
                                <a className="table-link" onClick={e =>
                                    this.handleReadArchiveButton(e, email, 'archived')}>
                                    {
                                        (email.archived) ?
                                            <OverlayTrigger placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        Unarchive
                                                    </Tooltip>
                                                }>
                                                <i className="material-icons-round icon-mail sm">unarchive</i>
                                            </OverlayTrigger> :
                                            <OverlayTrigger placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        Archive
                                                    </Tooltip>
                                                }>
                                                <i className="material-icons-round icon-mail sm">archive</i>
                                            </OverlayTrigger>
                                    }
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="text-left">
                            <strong>
                                From:
                            </strong>
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control className="text-center" plaintext readOnly defaultValue={user.email} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="text-left">
                            <strong>
                                To:
                            </strong>
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control className="text-center" plaintext
                                readOnly defaultValue={email.recipients.map(user => user.email).join(', ')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="text-left">
                            <strong>
                                Subject:
                            </strong>
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control className="text-center" plaintext readOnly defaultValue={email.subject} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="text-left">
                            <strong>
                                Timestamp:
                            </strong>
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control className="text-center" plaintext readOnly defaultValue={email.timestamp} />
                        </Col>
                    </Form.Group>
                    <hr></hr>
                    <Form.Group as={Row}>
                        <Col >
                            <Form.Control as="textarea" rows="7" plaintext readOnly defaultValue={email.body} />
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
        );
    }
}

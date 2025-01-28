const Spinner = ReactBootstrap.Spinner;
const Table = ReactBootstrap.Table;
const OverlayTrigger = ReactBootstrap.OverlayTrigger;
const Tooltip = ReactBootstrap.Tooltip;

export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mails: null,
            showButtons: {
                show: false,
                rowKey: ''
            }
        }

        this.showButtons = this.showButtons.bind(this);
        this.handleReadArchiveButton = this.handleReadArchiveButton.bind(this);
        this.handleReplyButton = this.handleReplyButton.bind(this);
    }

    componentDidMount() {
        this.getMailbox();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            this.getMailbox();
        }
    }

    showButtons(show, rowKey) {
        this.setState({
            showButtons: {
                show, rowKey
            }
        });
    }

    handleReplyButton(e, emailId) {
        e.stopPropagation();
        this.props.setCurrentEmailId(emailId);
        this.props.setScreen('reply');
    }

    handleReadArchiveButton(e, email, option, updateHelper) {
        e.stopPropagation();
        this.updateReadArchive(email, option, updateHelper);
    }

    getMailbox() {
        const type = this.props.type;
        fetch(`/emails/${type}`, {
            "method": 'GET',
            "credentials": 'include',
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(mails => this.setState({ mails }),
                error => console.log(error.message));
    }

    updateReadArchive(email, option, updateHelper) {
        email[option] = (updateHelper.name === "updateReadViewHelper") ?
            true : !email[option];
        fetch(`/emails/${email.id}`, {
            "method": 'PUT',
            "credentials": 'include',
            "body": JSON.stringify({
                [option]: email[option]
            }),
            "headers": {
                "X-CSRFToken": Cookies.get('csrftoken'),
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(_ => updateHelper(this, email),
                error => console.log(error.message));
    }

    getMailButtons(email) {
        return (
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
                    this.handleReadArchiveButton(e, email, 'read', this.updateReadHelper)}>
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
                    this.handleReadArchiveButton(e, email, 'archived', this.updateArchiveHelper)}>
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
        );
    }

    render() {
        const { mails, showButtons } = this.state;
        const { type } = this.props;

        if (!mails) {
            return (
                <div className="m-auto" style={{ "width": "fit-content" }}>
                    <Spinner animation="grow" variant="dark" />
                </div>
            )
        }
        else if (mails.length === 0) {
            return <h5 className="text-center">You don't have any mails.</h5>
        }

        return (
            <Table borderless hover responsive>
                <tbody>
                    {
                        mails.map(email =>
                            <tr key={email.id} className={!email.read ? "not-read" : ""}
                                onMouseEnter={_ => this.showButtons(true, email.id)}
                                onMouseLeave={_ => this.showButtons(false, email.id)}
                                onClick={e => this.handleReadArchiveButton(e, email, 'read', this.updateReadViewHelper)}>
                                <td className={!email.read ? "not-read sender" : ""}>
                                    <span>
                                        {
                                            (type === "sent") ? email.recipients.map(user =>
                                                `${user.first_name} ${user.last_name}`).join(', ') :
                                                `${email.sender.first_name} ${email.sender.last_name}`
                                        }
                                    </span>
                                </td>
                                <td className={!email.read ? "not-read subject" : ""}>
                                    <span>
                                        {email.subject}
                                    </span>
                                </td>
                                <td className="text-muted">
                                    <span>
                                        {email.body}
                                    </span>
                                </td>
                                <td className="text-right">
                                    {
                                        (showButtons.rowKey == email.id && showButtons.show) ?
                                            this.getMailButtons(email) :
                                            <span>
                                                {email.timestamp}
                                            </span>
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        );
    }

    updateArchiveHelper(oldThis, email) {
        oldThis.setState({
            mails: oldThis.state.mails.filter(m => m.id !== email.id)
        });
    }

    updateReadHelper(oldThis, email) {
        const tempArray = oldThis.state.mails.slice();
        const foundIndex = tempArray.findIndex(m => m.id === email.id);
        tempArray[foundIndex] = email;
        oldThis.setState({ mails: tempArray });
    }

    updateReadViewHelper(oldThis, email) {
        oldThis.props.setCurrentEmailId(email.id);
        oldThis.props.setScreen('view');
    }
}

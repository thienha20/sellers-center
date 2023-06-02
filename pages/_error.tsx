import {Component} from 'react'

type ErrorComponentProps = {
    statusCode?: number;
}

class Error extends Component<ErrorComponentProps> {

    static getInitialProps({ res, err }: any): ErrorComponentProps {
        const statusCode = res ? res.statusCode : err ? err.statusCode : 404
        return { statusCode }
    }

    render() {
        let {statusCode} = this.props;
        return (
            <p>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </p>
        )
    }
}
export default Error
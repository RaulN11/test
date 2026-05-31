export default function ErrorMessage({ message }) {
    if (!message) return null
    return (
        <div className="error-msg fade-in">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{message}</span>
        </div>
    )
}
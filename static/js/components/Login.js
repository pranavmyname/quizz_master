const Login = () => {
    const [username, setUsername] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Submit the form programmatically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/login';
        
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.value = username;
        
        form.appendChild(usernameInput);
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="text-center mb-4">Quiz Master</h1>
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Start Quizzing'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

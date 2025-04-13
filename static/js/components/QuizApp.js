const QuizApp = ({ username }) => {
    const [question, setQuestion] = React.useState('');
    const [answer, setAnswer] = React.useState('');
    const [evaluation, setEvaluation] = React.useState('');
    const [correctAnswer, setCorrectAnswer] = React.useState('');
    const [score, setScore] = React.useState({ correct: 0, total: 0 });
    const [selectedGenre, setSelectedGenre] = React.useState('General Knowledge');
    const [loading, setLoading] = React.useState(false);
    const [showAnswer, setShowAnswer] = React.useState(false);
    
    const genres = [
        'General Knowledge', 'History', 'Science', 'Geography', 
        'Literature', 'Movies', 'Music', 'Sports', 'Technology'
    ];
    
    React.useEffect(() => {
        fetchScore();
    }, []);
    
    const fetchScore = async () => {
        try {
            const response = await fetch('/score');
            const data = await response.json();
            if (data && !data.error) {
                setScore(data);
            }
        } catch (error) {
            console.error('Error fetching score:', error);
        }
    };
    
    const fetchQuestion = async () => {
        setLoading(true);
        setQuestion('');
        setAnswer('');
        setEvaluation('');
        setCorrectAnswer('');
        setShowAnswer(false);
        
        try {
            const response = await fetch('/get-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genre: selectedGenre }),
            });
            
            const data = await response.json();
            if (data && data.question) {
                setQuestion(data.question);
            } else {
                alert('Failed to get a question. Please try again.');
            }
        } catch (error) {
            console.error('Error getting question:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const submitAnswer = async () => {
        if (!question || !answer.trim()) return;
        
        setLoading(true);
        
        try {
            const response = await fetch('/submit-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, answer }),
            });
            
            const data = await response.json();
            if (data) {
                setEvaluation(data.evaluation);
                setCorrectAnswer(data.correct_answer);
                setShowAnswer(true);
                fetchScore();
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading && question && !showAnswer) {
            submitAnswer();
        }
    };
    
    return (
        <div className="quiz-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Quiz Master</a>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <span className="nav-link">Welcome, {username}!</span>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <span className="navbar-text me-3">
                                Score: {score.correct}/{score.total}
                            </span>
                            <a href="/logout" className="btn btn-outline-light">Logout</a>
                        </div>
                    </div>
                </div>
            </nav>
            
            <div className="card mb-4 shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Quiz Settings</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="genre">Select Genre:</label>
                                <select 
                                    id="genre" 
                                    className="form-control" 
                                    value={selectedGenre} 
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                >
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button 
                                className="btn btn-primary btn-lg w-100" 
                                onClick={fetchQuestion}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Get New Question'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {question && (
                <div className="card shadow mb-4 question-card">
                    <div className="card-header bg-info text-white">
                        <h3 className="mb-0">Question</h3>
                    </div>
                    <div className="card-body">
                        <p className="question-text">{question}</p>
                        
                        {!showAnswer ? (
                            <div className="answer-section">
                                <div className="form-group mb-3">
                                    <label htmlFor="answer" className="form-label">Your Answer:</label>
                                    <input
                                        type="text"
                                        id="answer"
                                        className="form-control form-control-lg"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                                <button 
                                    className="btn btn-success btn-lg w-100" 
                                    onClick={submitAnswer}
                                    disabled={loading || !answer.trim()}
                                >
                                    {loading ? 'Checking...' : 'Submit Answer'}
                                </button>
                            </div>
                        ) : (
                            <div className="result-section">
                                <div className={`alert ${evaluation.includes('PASS') ? 'alert-success' : 'alert-danger'}`}>
                                    <h4 className="alert-heading">{evaluation.includes('PASS') ? 'Correct!' : 'Incorrect!'}</h4>
                                    <p>{evaluation}</p>
                                    <hr />
                                    <p className="mb-0"><strong>Correct answer:</strong> {correctAnswer}</p>
                                </div>
                                <button 
                                    className="btn btn-primary btn-lg w-100" 
                                    onClick={fetchQuestion}
                                    disabled={loading}
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {!question && !loading && (
                <div className="text-center mt-5">
                    <h3>Click "Get New Question" to start the quiz!</h3>
                </div>
            )}
        </div>
    );
};

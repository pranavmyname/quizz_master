document.addEventListener('DOMContentLoaded', function() {
    const quizAppElement = document.getElementById('quiz-app');
    if (quizAppElement) {
        const username = quizAppElement.getAttribute('data-username');
        ReactDOM.render(
            <QuizApp username={username} />,
            quizAppElement
        );
    }
});

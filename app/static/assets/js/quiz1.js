document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quizForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the normal submission of the form
        console.log("Form submission prevented."); // Debugging statement

        const correctAnswers = ['Sie', 'Du', 'Sie', 'Wie geht\'s?', 'Guten Tag'];
        let score = 0;

        // Get user answers and compare them to correct answers
        correctAnswers.forEach((answer, index) => {
            const questionNumber = index + 1;
            const userAnswer = document.querySelector(`input[name="q${questionNumber}"]:checked`)?.value;
            console.log(`Answer for question ${questionNumber}:`, userAnswer); // Debug user answers

            if (userAnswer === answer) {
                score++;
            }
        });

        console.log("Total score:", score); // Check if score calculation is correct
        const result = document.getElementById('result');
        if (result) {
            result.textContent = `You scored ${score} out of ${correctAnswers.length}.`;
            console.log(result.textContent); // Verify that textContent is set correctly

            // Force styles to ensure visibility
            result.style.color = 'black'; // Change color to ensure visibility
            result.style.fontSize = '20px'; // Increase font size for clarity
            result.style.backgroundColor = 'white'; // Use a contrasting background
            result.style.padding = '10px'; // Add padding for better layout
            result.style.border = '1px solid black'; // Add border to highlight the result box
        } else {
            console.log("Result element not found"); // Debugging for missing result element
        }
    });
});

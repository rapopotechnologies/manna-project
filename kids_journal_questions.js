document.addEventListener('DOMContentLoaded', function () {
    // Array of questions
    const allQuestions = [
      { text: "What three activities do you currently enjoy doing?", reference: "- Manna Kids -" },
      { text: "Name three friends you have made at school. What is your best memory with each of them?", reference: "- Manna Kids -" },
      { text: "What is one thing you look forward to with your family or siblings every week and why?", reference: "- Manna Kids -" },
      { text: "What is your favorite holiday? Why are you thankful for this holiday?", reference: "- Manna Kids -" },
      { text: "What were the last three nice things done for you by others?", reference: "- Manna Kids -" },
      { text: "What is something your parents do for you regularly that makes you thankful for them?", reference: "- Manna Kids -" },
      { text: "Who is someone you know that is always grateful and thanking others for their kind actions?", reference: "- Manna Kids -" },
      { text: "Name one teacher or school staff member that you are grateful for.", reference: "- Manna Kids -" },
      { text: "Describe a family tradition that makes you feel grateful for your family's bond.", reference: "- Manna Kids -" },
      { text: "Who's someone in your family you're glad to have? Why?", reference: "- Manna Kids -" },
      { text: "Name your favorite food. Why are you grateful for it?", reference: "- Manna Kids -" },
      { text: "When was the last time you helped someone?", reference: "- Manna Kids -" },
      { text: "What’s one thing you’re looking forward to?", reference: "- Manna Kids -" },
      { text: "Describe a time you had fun with friends. What made it special?", reference: "- Manna Kids -" },
      { text: "What is your favorite holiday memory?", reference: "- Manna Kids -" },
      { text: "What is something nice someone did for you recently? Have you thanked them?", reference: "- Manna Kids -" },
      { text: "What’s your favorite movie? Describe your favorite scene. Why is it awesome?", reference: "- Manna Kids -" },
      { text: "Who is your favorite teacher? What do they do to inspire you to learn?", reference: "- Manna Kids -" },
      { text: "What’s your favorite room in your house? Why do you like it better than the other rooms?", reference: "- Manna Kids -" },
      { text: "What’s the best book you’ve ever read? What did you like best about the characters?", reference: "- Manna Kids -" },
      { text: "What subject or class do you like best in school? What’s the most interesting thing about that topic?", reference: "- Manna Kids -" },
      { text: "What’s your favorite animal? What do you love about that animal?", reference: "- Manna Kids -" },
      { text: "What’s your favorite color? Why is it special to you?", reference: "- Manna Kids -" },
      { text: "What’s your favorite song? How does it make you feel when you hear it?", reference: "- Manna Kids -" },
      { text: "What does the perfect weekend look like?", reference: "- Manna Kids -" },
      { text: "Who is someone you love to be around? How does that person make you feel?", reference: "- Manna Kids -" },
      { text: "What’s the best gift you’ve ever received? How did it make you feel?", reference: "- Manna Kids -" },
      { text: "Describe a hobby that brings you joy? What do you love about it?", reference: "- Manna Kids -" },
      { text: "What’s your favorite meal? What makes it so delicious?", reference: "- Manna Kids -" },
      { text: "Who inspires you the most? How do they inspire you?", reference: "- Manna Kids -" },
      { text: "What place do you like most? What is special about that place?", reference: "- Manna Kids -" },
      { text: "Name a family member you love to be around most. Why?", reference: "- Manna Kids -" },
      { text: "What’s the best thing about your neighborhood? Why?", reference: "- Manna Kids -" },
      { text: "Name something in nature that you truly admire. Why?", reference: "- Manna Kids -" },
      { text: "What’s your dream vacation? Why?", reference: "- Manna Kids -" },
      { text: "What’s your favorite time of day? Why?", reference: "- Manna Kids -" },
      { text: "What is your favorite quote? Why is it meaningful to you?", reference: "- Manna Kids -" },
      { text: "Name something that inspires you to be helpful. Why?", reference: "- Manna Kids -" },
      { text: "What physical activity do you love the most? Why is it important to you?", reference: "- Manna Kids -" },
      { text: "What act of kindness is most meaningful to you? Why?", reference: "- Manna Kids -" },
      { text: "What is your favorite game? Who do you like playing it with?", reference: "- Manna Kids -" },
      { text: "What’s your favorite holiday?", reference: "- Manna Kids -" },
      { text: "What is your favorite bible verse? Why is it meaningful to you?", reference: "- Manna Kids -" },
      { text: "What is the best thing that happened to you today?", reference: "- Manna Kids -" },
      { text: "Who is your favorite person and why?", reference: "- Manna Kids -" },
      { text: "What is your favorite thing about school?", reference: "- Manna Kids -" },
      { text: "What is something that makes you happy?", reference: "- Manna Kids -" },
      { text: "Who makes you feel loved and how?", reference: "- Manna Kids -" },
      { text: "Name a friend and describe what makes them special to you.", reference: "- Manna Kids -" },
      { text: "What is your favorite toy?", reference: "- Manna Kids -" },
      { text: "Where is your favorite place to go?", reference: "- Manna Kids -" },
      { text: "Who makes you feel loved and how?", reference: "- Manna Kids -" },
      { text: "Describe one of your favorite memories this year.", reference: "- Manna Kids -" },
      { text: "What is your favorite thing about your home?", reference: "- Manna Kids -" },
      { text: "What was the last gift you received?", reference: "- Manna Kids -" },
      { text: "What is your favorite thing to do for fun?", reference: "- Manna Kids -" },
      { text: "What is something you use every day?", reference: "- Manna Kids -" },
      { text: "What skill are you most thankful for?", reference: "- Manna Kids -" },
      { text: "What is something nice your parents do for you?", reference: "- Manna Kids -" },
      { text: "What do you love about each family member?", reference: "- Manna Kids -" },
      { text: "What do you enjoy eating?", reference: "- Manna Kids -" },
      { text: "What is your favorite time of day?", reference: "- Manna Kids -" },
      { text: "What is your favorite animal?", reference: "- Manna Kids -" },
      { text: "What is your favorite thing about your room?", reference: "- Manna Kids -" },
      { text: "What is your favorite song?", reference: "- Manna Kids -" },
      { text: "What accomplishment are you proud of?", reference: "- Manna Kids -" },
      { text: "What family tradition is your favorite?", reference: "- Manna Kids -" },
      { text: "What was your favorite trip?", reference: "- Manna Kids -" },
      { text: "Describe something that makes you laugh.", reference: "- Manna Kids -" },
      { text: "Describe a time someone was kind to you.", reference: "- Manna Kids -" },
      { text: "What are you most thankful for?", reference: "- Manna Kids -" },
      { text: "Who are you most thankful for in your life?", reference: "- Manna Kids -" },
      { text: "If you wanted to show someone you are grateful for their kindness, how would you show them?", reference: "- Manna Kids -" },
      { text: "What are three things that make you proud of and grateful for your country?", reference: "- Manna Kids -" },
      { text: "Have you exercised a random act of kindness today for someone? Take a few minutes to describe this event.", reference: "- Manna Kids -" },
      { text: "Even if today did not start off in the best way, are you still grateful for the day?", reference: "- Manna Kids -" },
      { text: "What are some skills that you have developed lately that you are proud of and thankful for?", reference: "- Manna Kids -" },
      { text: "Do you have a pet? Why are you grateful for this pet?", reference: "- Manna Kids -" },
      { text: "When you think about kids in other countries who may not have access to the same things you do. What are some things that you are grateful for?", reference: "- Manna Kids -" },
      { text: "What are some things you may have taken for granted?", reference: "- Manna Kids -" },
      { text: "Write a short thank you note to three people who have been kind to you in the last couple of weeks.", reference: "- Manna Kids -" },
      { text: "What are three things about your health that you are most thankful for?", reference: "- Manna Kids -" },
      { text: "What is something good that happened to you today?", reference: "- Manna Kids -" },
      { text: "Take a small gift for your teacher to show your gratitude.", reference: "- Manna Kids -" },
      { text: "What talent do you have that you are grateful for?", reference: "- Manna Kids -" },
      { text: "What is a favorite item you own? Who gave it to you? Tell them you’re grateful for it.", reference: "- Manna Kids -" },
      { text: "Compliment a friend today.", reference: "- Manna Kids -" },
      { text: "What do you like about your town? Why are you grateful to live there?", reference: "- Manna Kids -" },
      { text: "What do you love about your parents? Tell them how thankful you are to have them.", reference: "- Manna Kids -" },
      { text: "Make a homemade gift for a friend or sibling.", reference: "- Manna Kids -" },
      { text: "Who is your favorite person at school? Why are you thankful for this person?", reference: "- Manna Kids -" },
      { text: "Name three things you see in your home that you are grateful for today.", reference: "- Manna Kids -" },
      { text: "What technology are you thankful to have in your home?", reference: "- Manna Kids -" },
      { text: "What was something nice that you witnessed today?", reference: "- Manna Kids -" },
      { text: "What is your favorite thing to do outside? Why are you thankful for them?", reference: "- Manna Kids -" },
      { text: "Who is someone that makes you laugh or smile a lot? Why are you thankful for this person?", reference: "- Manna Kids -" },
      { text: "Name something in your room that you are grateful for. Where did it come from?", reference: "- Manna Kids -" },
      { text: "What is your favorite family tradition or activity? Why are you thankful for this tradition?", reference: "- Manna Kids -" },
      { text: "What are you grateful for about the country you live in?", reference: "- Manna Kids -" },
      { text: "Fill in the blank: I am thankful I can….", reference: "- Manna Kids -" }
      // Add more questions as needed
    ];
  
    let selectedQuestion = JSON.parse(localStorage.getItem('selectedQuestion'));
    let lastQuestionUpdateTime = parseInt(localStorage.getItem('lastQuestionUpdateTime')) || 0;
    let refreshCounter = parseInt(localStorage.getItem('refreshCounter')) || 0;
    const maxRefreshesPerDay = 3;
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  
    // Function to select a random question from the list of unused questions
    function getRandomQuestion() {
      return allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }
  
    // Function to update the question displayed
    function updateQuestion() {
      const currentTime = new Date().getTime();
      if (!selectedQuestion || currentTime - lastQuestionUpdateTime >= twentyFourHoursInMilliseconds) {
        selectedQuestion = getRandomQuestion();
        localStorage.setItem('selectedQuestion', JSON.stringify(selectedQuestion));
        localStorage.setItem('lastQuestionUpdateTime', currentTime);
        localStorage.setItem('refreshCounter', '0'); // Reset refresh counter
      } else if (refreshCounter < maxRefreshesPerDay) {
        refreshCounter++;
        localStorage.setItem('refreshCounter', refreshCounter.toString());
      }
      document.getElementById('question-text').textContent = selectedQuestion.text;
      document.getElementById('question-reference').textContent = selectedQuestion.reference;
    }
  
    // Initial update
    updateQuestion();
  
    // Update the question every hour
    setInterval(updateQuestion, 3600 * 1000); // 1 hour in milliseconds
  });
  
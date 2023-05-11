document.addEventListener("DOMContentLoaded", function()
{

    async function createWordList() // Set the array of words.
    {
        let wordList=[[], [], []];
        const response = await fetch('itemList.json');
        const data = await response.json();
        wordList[0].push(...data.Things);
        wordList[1].push(...data.Places);
        wordList[2].push(...data.Animals);
        return wordList;
    }
    
    function randomWord(wordList, category = -1) // Pick a random word.
    {
        let word;
        if(category === -1) // Random category.
        {
            const randomCategory = Math.floor(Math.random() * 3);
            const randomWord = Math.floor(Math.random() * wordList[randomCategory].length);
            return wordList[randomCategory][randomWord];
        }
        const randomIndex = Math.floor(Math.random() * wordList[category].length);
        word = wordList[category][randomIndex];
        return word;
    }

    function checkWin(data) // Check for win.
    {
        return ((data.spaceCount || data.dashCount) && (data.rightLetter.length === data.word.length-data.spaceCount-data.dashCount))||(data.rightLetter.length === data.word.length)
    }

    function endGame(win) // Finish the game.
    {
        document.getElementById("lettersField").classList.remove("flex");
        if(win) document.getElementById("winBox").classList.remove("hide");
        else document.getElementById("loseBox").classList.remove("hide");
        return;
    }

    function countSpaceDash(word) // Counts spaces and dashes.
    {
        let spaceCount = 0;
        let dashCount = 0;
        for (let i = 0; i < word.length; i++)
        {
            if(word[i] === " ")spaceCount++;
            if(word[i] === "-")dashCount++;
        }
        return [spaceCount, dashCount];
    }

    function checkCustomWord(word) // Check custom word before starting the game.
    {
        for (let i = 0; i < word.length; i++)
        {
            if(!/^[A-Z \-]$/.test(word[i]))
            {
                document.getElementById("errorTxt").classList.add("flex");
                return;
            }
        }
        document.getElementById("errorTxt").classList.remove("flex");
        setHangman(word, "Cetegory: Custom");
    }

    function setPageItems(word, chosenCategory) // Reset the items to start the game.
    {
        document.querySelectorAll('img.hangImg').forEach(image => image.classList.add('hide'));
        document.getElementById("wordInput").value="";
        document.getElementById("lettersField").classList.add("flex");
        document.getElementById("loseBox").classList.add("hide");
        document.getElementById("winBox").classList.add("hide");
        document.getElementById("letters").innerHTML="";
        document.getElementById("chosenCategory").innerHTML=chosenCategory;
        document.getElementById("theWord").innerHTML=`<br>The word was ${word.toLowerCase().charAt(0).toUpperCase() + word.toLowerCase().slice(1)}.`;
        console.log("the word is ", word);
    }

    function setLetterBoxes(word) // Set the dashed lines for the letters.
    {
        for (let i = 0; i < word.length; i++)
        {
            const letter = document.createElement('div');
            letter.classList.add('letterBox');
            if((word[i] === " ")||(word[i] === "-"))letter.classList.add('blankLetterBox');
            if(word[i] === "-")letter.innerHTML="-";
            document.getElementById("letters").appendChild(letter);
        }
    }

    function setLettersField() // Reset the buttons to get rid of the old game.
    {   
        const lettersField = document.getElementById("lettersField");
        lettersField.innerHTML = "";
        for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++)
        {
            const input = document.createElement('div');
            input.classList.add("inputLetter");
            input.innerHTML = String.fromCharCode(i);
            lettersField.appendChild(input);
        }
    }

    function hangBody(hangStatus) // Add a piece of the hangman and fails if there's 6.
    {
        let imgHang="hang"+hangStatus.toString();
        document.getElementById(imgHang).classList.remove('hide');
        if(hangStatus >= 6)
        {
            endGame(false);
            return;
        }
    }

    function checkLetter(data) // Check the clicked letter.
    {
        return function(e)
        {
            let guess = e.target.innerHTML;
            let guessedRight = false;
            if ((data.wrongLetter.includes(guess))||(data.rightLetter.includes(guess))) return;
            for (let i = 0; i <= data.word.length; i++)
                if(data.word[i] === guess)
                {
                    data.rightLetter += guess;
                    document.querySelector(`#letters :nth-child(${i+1})`).innerHTML=guess;
                    guessedRight = true;
                    if(checkWin(data))
                    {
                        endGame(true);
                        return;
                    }
                }
            if(!guessedRight)
            {
                data.wrongLetter += guess;
                hangBody(data.wrongLetter.length);
            }
            e.target.classList.add("greyed");
        };
    }

    function setHangman(word, chosenCategory) // Start the game.
    {
        let nSpaceDash=countSpaceDash(word);
        setPageItems(word, chosenCategory);
        setLetterBoxes(word);
        setLettersField();
        const data =
        {
            rightLetter: "",
            wrongLetter: "",
            spaceCount: nSpaceDash[0],
            dashCount: nSpaceDash[1],
            word: word
        };
        document.querySelectorAll(".inputLetter").forEach(button =>
        {
            button.addEventListener('click', checkLetter(data));
        });
    }

    document.getElementById("button1").addEventListener("click", async function() {
        setHangman(randomWord(await createWordList()), "Cetegory: Random")}); // Random word button.

    document.getElementById("button2").addEventListener("click", async function() {
        setHangman(randomWord(await createWordList(), 0), "Cetegory: Things")}); // Things button.

    document.getElementById("button3").addEventListener("click", async function() {
        setHangman(randomWord(await createWordList(), 1), "Cetegory: Places")}); // Places button.

    document.getElementById("button4").addEventListener("click", async function() {
        setHangman(randomWord(await createWordList(), 2), "Cetegory: Animals")}); // Animals button.

    document.getElementById("button5").addEventListener("click", function() {
        checkCustomWord(document.getElementById("wordInput").value.toString().toUpperCase())}); // Custom word button.
});
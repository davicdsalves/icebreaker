var englishQuestions = [
    "If you could have any superpower, what would it be and why?",
    "What is your favorite hobby or pastime?",
    "If you could travel anywhere in the world, where would you go and why?",
    "What is the most memorable concert or live performance you have attended?",
    "If you could meet any historical figure, who would it be and what would you ask them?",
    "What is your favorite book or movie and why?",
    "If you could have dinner with any fictional character, who would it be and why?",
    "What is one thing on your bucket list that you hope to achieve?",
    "If you could learn any new skill instantly, what would it be and why?",
    "What is your favorite way to relax and unwind after a long day?"
];

var portugueseQuestions = [
    "Qual é o seu hobby favorito?",
    "Se você pudesse ter um superpoder, qual seria?",
    "Qual é a sua música favorita para cantar no karaokê?",
    "Qual é o seu livro ou filme favorito?",
    "Se você pudesse viajar para qualquer lugar do mundo, para onde iria?",
    "Qual é a aventura mais emocionante que você já viveu?",
    "Se você pudesse conhecer qualquer figura histórica, quem seria?",
    "Qual é a sua maneira favorita de relaxar após um dia longo?",
    "Qual é o seu sabor de sorvete favorito?",
    "Se você pudesse jantar com qualquer personagem fictício, quem seria?"
];

let questions = [];
let dynamicQuestions = [];

function toggleConfig() {
    var content = $("#configContent");
    var arrow = $("#configArrow");

    if (content.hasClass("collapsed")) {
        content.removeClass("collapsed");
        arrow.removeClass("fa-chevron-right").addClass("fa-chevron-down");
    } else {
        content.addClass("collapsed");
        arrow.removeClass("fa-chevron-down").addClass("fa-chevron-right");
    }
}

function getPrompt(language, theme = "") {
    const themeInstruction = theme ? (language === 'pt'
        ? `\n\nTEMA ESPECÍFICO: Foque as perguntas no tema "${theme}".`
        : `\n\nSPECIFIC THEME: Focus the questions around the theme "${theme}"`) : "";

    const languageInstruction = language.toLowerCase() === 'pt'
        ? "Responda em português brasileiro."
            : "Respond in English.";

    return `
    Create exactly 40 creative and engaging icebreaker questions.
        
        IMPORTANT RULES:
        - Avoid obvious questions like "what's your favorite color"
        - Focus on questions that stimulate reflection and experience sharing
        - Include questions about values, life experiences, interesting dilemmas
        - Mix light questions with some deeper ones
        - Be fun but not too personal or controversial
        - Ensure they're appropriate for professional environments
        - Return ONLY the questions, one per line, without numbering or extra formatting
        
        Examples of the desired style:
        - If you could have a conversation with yourself from 10 years ago, what advice would you give?
        - What's the biggest risk you've ever taken that paid off?
        - If you could solve one world problem, which would you choose?            
        
        ${languageInstruction}
        
        ${themeInstruction}
    `;
}

$(document).ready(function () {
    function getQueryParams() {
        const params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    function addUsersFromQueryParam() {
        const queryParams = getQueryParams();
        const usersParam = queryParams["users"];
        if (usersParam) {
            const userList = $("#userList");
            const newUsers = usersParam.split(",");
            $.each(newUsers, function (index, username) {
                username = username.trim();
                if (username) {
                    const listItem = $("<li>").text(username);
                    userList.append(listItem);
                }
            });
        }
    }

    function initializeQuestions() {
        const queryParams = getQueryParams();
        const language = queryParams["language"] || $("#languageSelect").val();
        $("#languageSelect").val(language);
        questions = language === "pt" ? portugueseQuestions : englishQuestions;
    }

    addUsersFromQueryParam();
    initializeQuestions();

    $("#languageSelect").change(function() {
        const language = $(this).val();
        questions = language === "pt" ? portugueseQuestions : englishQuestions;

        // If we have dynamic questions, keep using them
        if (dynamicQuestions.length > 0) {
            questions = dynamicQuestions;
        }
    });

    function showStatus(message, isError = false) {
        var statusDiv = $("#statusMessage");
        statusDiv.removeClass("status-success status-error");
        statusDiv.addClass(isError ? "status-error" : "status-success");
        statusDiv.text(message);
        statusDiv.show();

        setTimeout(function() {
            statusDiv.fadeOut();
        }, 5000);
    }

    $("#loadQuestionsButton").click(function() {
        var apiUrl = $("#apiUrl").val().trim();
        var token = $("#requesterToken").val().trim();
        var language = $("#languageSelect").val();

        if (!apiUrl) {
            showStatus("Please enter an API URL", true);
            return;
        }

        if (!token) {
            showStatus("Please enter a bearer token", true);
            return;
        }

        var button = $(this);
        button.addClass("loading").prop("disabled", true);
        button.html('<i class="fas fa-spinner fa-spin"></i> Loading...');

        var theme = $("#themeInput").val().trim();
        var prompt = getPrompt(language, theme);

        $.ajax({
            url: apiUrl,
            method: 'POST',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify({
                model: $("#modelSelect").val() || "claude-sonnet-4-20250514-v1.0",
                messages: [{"role": "user", "content": prompt}]
            }),
            success: function(response) {
                try {
                    var content = response.choices[0].message.content;
                    var newQuestions = content.split('\n')
                        .map(function(q) { return q.trim(); })
                        .filter(function(q) { return q.length > 0 && !q.match(/^\d+\.?\s*/); });

                    if (newQuestions.length > 0) {
                        dynamicQuestions = newQuestions;
                        questions = dynamicQuestions;
                        showStatus("Successfully loaded " + newQuestions.length + " questions!");
                        $("#generatedQuestion").text("Dynamic questions loaded! Click 'Play' to start.");
                    } else {
                        showStatus("No valid questions found", true);
                    }
                } catch (error) {
                    showStatus("Error parsing response: " + error.message, true);
                }
            },
            error: function(xhr, status, error) {
                var errorMsg = "Failed to load questions: ";
                if (xhr.status === 405) {
                    errorMsg += "invalid model";
                } else if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg += xhr.responseJSON.error.message || error;
                } else {
                    errorMsg += error;
                }
                showStatus(errorMsg, true);
            },
            complete: function() {
                button.removeClass("loading").prop("disabled", false);
                button.html('<i class="fas fa-download"></i> Load Questions from LLM');
            }
        });
    });

    $('#themeButton').click(function() {
        $('body').toggleClass('dark-theme');
        if ($('body').hasClass('dark-theme')) {
            $(this).html('<i class="fas fa-sun"></i> ');
        } else {
            $(this).html('<i class="fas fa-moon"></i> ');
        }
    });

    $("#removeQuestionButton").click(function () {
        var currentQuestion = $("#generatedQuestion").text();
        var index = questions.indexOf(currentQuestion);
        if (index > -1) {
            questions.splice(index, 1);
        }
        $("#generatedQuestion").text("Question removed. Click the 'Play' button for a new one.");
    });

    var intervalId;

    $("#playButton").click(function () {
        if (questions.length === 0) {
            showStatus("No questions available. Load questions from LLM or use default ones.", true);
            return;
        }

        $(this).prop("disabled", true);
        $("#pauseButton").prop("disabled", false);
        $("#removeQuestionButton").prop("disabled", true);
        intervalId = setInterval(function () {
            var randomNumber = Math.floor(Math.random() * questions.length);
            var generatedQuestion = questions[randomNumber];
            $("#generatedQuestion").text(generatedQuestion);
        }, 50);
    });

    $("#pauseButton").click(function () {
        $("#playButton").prop("disabled", false);
        $("#removeQuestionButton").prop("disabled", false);
        $(this).prop("disabled", true);
        clearInterval(intervalId);
    });

    $("#addUserButton").click(function () {
        var usernames = prompt("Enter usernames separated by commas:");
        if (usernames) {
            var userList = $("#userList");
            var newUsers = usernames.split(",").map(function (username) {
                return username.trim();
            });

            newUsers = newUsers.filter(function (username) {
                return !userList.find("li:contains('" + username + "')").length;
            });

            newUsers.forEach(function (username) {
                var listItem = $("<li>").text(username);
                userList.append(listItem);
            });

            updateURLWithUsers();
        }
    });

    function updateURLWithUsers() {
        var userList = $("#userList li");
        var usernames = userList
            .map(function () {
                return $(this).text();
            })
            .get()
            .join(",");

        var url = window.location.href;
        var regex = /[?&]users=[^&]+/i;
        url = url.replace(regex, "");

        if (usernames) {
            var separator = url.indexOf("?") === -1 ? "?" : "&";
            var updatedURL = url + separator + "users=" + encodeURIComponent(usernames);
            window.history.replaceState({}, "", updatedURL);
        } else {
            window.history.replaceState({}, "", url);
        }
    }

    $("#selectUserButton").click(function () {
        var userList = $("#userList");
        var users = userList.find("li");
        if (users.length > 0) {
            var selectedUser = users.first().text();
            $("#selectedUser").text("Selected User: " + selectedUser);
            users.first().remove();

            // Remove the question
            var currentQuestion = $("#generatedQuestion").text();
            var index = questions.indexOf(currentQuestion);
            if (index > -1) {
                questions.splice(index, 1);
            }
            $("#generatedQuestion").text("Question removed. Click 'Generate Question' for a new one.");
            updateURLWithUsers();
        } else {
            $("#selectedUser").text("No users available.");
        }
    });
});
        window.addEventListener("DOMContentLoaded", onLoad, false);
        let displayCurrentWinnerFullname = document.getElementById("current-winner-fullname");
        let displayCurrentWinnerId = document.getElementById("current-winner-id");
        let overlay = document.getElementById("overlay");

        let participants;
        let participantSize;
        let allPriceCategories = [];
        let currentPriceType;

        let generatorInterval = 10;
        let generatorAutoInterval = 5000;
        var audio = new Audio("./NhacXoSo.mp3");

        let winnerEffectCanvas, winnerEffectCanvasWidth, winnerEffectCanvasHeight,
            particles = [],
            probability = 0.04,
            xPoint, yPoint;
        let continueFirework = false;
        let continueCoinRain = false;

        function onLoad() {
            overlay.style.display = "none";
            for (let input of document.getElementsByClassName("winner-limit")) {
                input.addEventListener("keypress", function () {
                    allowDigitKey(event);
                });
            }
            winnerEffectCanvas = document.getElementById("winner-effect-overlay");
            ctx = winnerEffectCanvas.getContext("2d");
            hideGenerateButtons();
            hideConfirmPriceLimitButton();

            initAllPriceCategories();
        }

        function initAllPriceCategories() {
            for (let priceContainer of document.getElementsByClassName("grid-container")) {
                let priceCategory = {
                    priceName: '',
                    winners: [],
                    priceLimit: 0
                }
                let priceTitleElement = priceContainer.getElementsByClassName("price-title")[0];
                priceCategory.priceName = priceTitleElement.getElementsByTagName("span")[0].innerHTML;

                allPriceCategories.push(priceCategory);
            }
        }

        function setInitialPriceCategoryLimit() {
            let priceContainers = document.getElementsByClassName("grid-container");
            let limit = 0;
            for (let i = 0; i < priceContainers.length; i++) {
                limit = priceContainers[i].getElementsByClassName("winner-limit")[0].value;
                if (Number(limit) == 0 || limit == "") {
                    priceContainers[i].style.display = "none";
                } else {
                    allPriceCategories[i].priceLimit = limit;
                    priceContainers[i].getElementsByClassName("winner-limit")[0].disabled = true;
                }
            }
        }

        function allowDigitKey(event) {
            if (event.keyCode >= 48 && event.keyCode <= 57)
                return true;
            event.preventDefault();
            return false;
        }

        let generateWinner = function (winners, autoGenerate) {
            // if (generatorInterval > 500) {
            //     generatorInterval += 200;
            // }
            if (generatorInterval > 200) {
                generatorInterval += 100;
            }
            if (generatorInterval > 0) {
                generatorInterval += 10;
            }

            let randomIndex = Math.floor(Math.random() * participantSize);
            updateCurrentWinnerDisplay({
                Id: "",
                Fullname: participants[randomIndex].Fullname
            });

            if (generatorInterval <= 200) {
                setTimeout(function () {
                    generateWinner(winners, autoGenerate);
                }, 100);
            } else {
                let winner = {
                    Id: participants[randomIndex].Id,
                    Fullname: participants[randomIndex].Fullname
                };
                updateCurrentWinnerDisplay(winner);

                winners.push(winner);
                participants.splice(randomIndex, 1);
                participantSize = participants.length;
                updateWinnerList();

                generatorInterval = 10;

                if (allPriceCategories[currentPriceType].priceLimit == 0 || !autoGenerate) {
                    document.getElementById("ok-overlay").style.display = "block";
                } else {
                    document.getElementById("ok-overlay").style.display = "none";
                }

                showExportButton();
                updateFireworkCanvasDimension();
                currentPriceType == "0" ? showCoinRain() : showFirework();

                if (autoGenerate) {
                    setTimeout(function () {
                        if (allPriceCategories[currentPriceType].priceLimit > 0) {
                            document.getElementById("ok-overlay").style.display = "none";
                            hideCoinRain();
                            hideFirework();
                            generateWinner(winners, autoGenerate);
                        }
                    }, 500);
                }
            }
        };

        window.onbeforeunload = function () {
            if (window.confirm(
                    "Imported data and winner list will be lost upon refresh. Do you still want to reload?"))
                return true;
            return false;
        }

        function generateWinnerForPriceType(event, autoGenerate) {
            showOverlay();
            let generateButton = event.target;
            let priceCategoryContainers = document.getElementsByClassName("grid-container");
            for (let i = 0; i < priceCategoryContainers.length; i++) {
                let elem = priceCategoryContainers[i].getElementsByClassName("generate-button")[0];
                if (elem === generateButton) {
                    generateWinner(allPriceCategories[i].winners, autoGenerate);
                    currentPriceType = i;
                }
                elem = priceCategoryContainers[i].getElementsByClassName("generate-button")[1];
                if (elem === generateButton) {
                    generateWinner(allPriceCategories[i].winners, autoGenerate);
                    currentPriceType = i;
                }
            }
        }

        function updateCurrentWinnerDisplay(winner) {
            displayCurrentWinnerId.innerHTML = winner.Id;
            displayCurrentWinnerFullname.innerHTML = winner.Fullname;
        }

        function removeClassAfterStart() {
            for (let priceContainer of document.getElementsByClassName("grid-container")) {
                priceContainer.classList.remove("before-import");
                priceContainer.getElementsByClassName("price-title")[0].classList.remove("before-import");
            }
        }

        function confirmPriceLimit() {
            if (isParticipantsListEmpty()) {
                alert("Participant list is empty. Please import participant excel file before starting!");
                return;
            }
            if (isPriceLimitGreaterThanParticipants()) {
                alert("Cannot start because price limit is more than participants.")
                return;
            }

            setInitialPriceCategoryLimit();
            hideTitleInput();
            showTitleInputMessage();
            removeClassAfterStart();
            hideConfirmPriceLimitButton();
            hideImportExcelSection();
            showGenerateButtons();
            showExportButton();
            audio.play();
            audio.loop = true;
        }

        function totalPriceLimit() {
            let limitPrice = 0;
            allPriceCategories.forEach(element => {
                limitPrice += Number(element.priceLimit);
            });
            console.log(limitPrice);
            return limitPrice;
        }

        function showExportButton() {
            let total = totalPriceLimit();
            console.log(total);
            if (total == 0)
                document.getElementById("export").style.display = "block";
        }

        function showConfirmPriceLimitButton() {
            document.getElementById("confirm-button").style.display = "block";
        }

        function hideConfirmPriceLimitButton() {
            document.getElementById("confirm-button").style.display = "none";
        }

        function showGenerateButtons() {
            for (let generateButton of document.getElementsByClassName("generate-button")) {
                generateButton.style.display = "inline-block";
            }
        }

        function showGenerateButtonOfPriceType(priceType) {
            let priceContainer = document.getElementsByClassName("grid-container")[priceType];
            for (let generateButton of priceContainer.getElementsByClassName("generate-button")) {
                generateButton.style.display = "inline-block";
            }
        }

        function hideGenerateButtons() {
            for (let generateButton of document.getElementsByClassName("generate-button")) {
                generateButton.style.display = "none";
            }
        }

        function hideImportExcelButton() {
            document.getElementById("excel-import-button").style.display = "none";
        }

        function hideImportExcelSection() {
            document.getElementById("excel-import").style.display = "none";
        }

        function isParticipantsListEmpty() {
            return (participants === undefined || Number(participants.length) == 0) ? true : false;
        }

        function isPriceLimitGreaterThanParticipants() {
            let priceLimit = 0;
            for (let input of document.getElementsByClassName("winner-limit")) {
                if (input.value != "") {
                    priceLimit += Number(input.value);
                }
            }
            return priceLimit > participantSize ? true : false;
        }

        function readExcelFile(event) {
            var input = event.target;
            var reader = new FileReader();
            let isImported = false;
            reader.onload = function () {
                let fileData = reader.result;
                let wb = XLSX.read(fileData, {
                    type: 'binary'
                });

                wb.SheetNames.forEach(function (sheetName) {
                    input.value = "";

                    if (wb.Sheets[sheetName].A1 === undefined || wb.Sheets[sheetName].B1 === undefined || wb
                        .Sheets[sheetName].A1.v != "Id" || wb.Sheets[sheetName].B1.v != "Fullname") {
                        alert(
                            "The format of the given excel file is not correct! First column must be Id, second column must be Fullname! Please check again."
                        );
                        return;
                    }

                    let rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                    for (let row of rowObj) {
                        if (row.Id === undefined) {
                            alert(`Row number ${row.__rowNum__ + 1} does not have Id. Please check again!`);
                            return;
                        }

                        if (row.Fullname === undefined) {
                            alert(
                                `Row number ${row.__rowNum__ + 1} does not have Fullname. Please check again!`
                            );
                            return;
                        }
                    }

                    participants = rowObj;
                    participantSize = participants.length;
                    isImported = true;
                })
            };

            reader.onloadend = function () {
                if (isImported) {
                    showSuccessExcelImportMessageWithParticipantAmount(participantSize);
                    hideImportExcelButton();
                    showConfirmPriceLimitButton();
                }
            };
            reader.readAsBinaryString(input.files[0]);
        }

        function removeWinnerFromList(event, winner) {
            if (!window.confirm("Are you sure you want to remove this winner from this list?")) {
                return;
            }

            let isRemoved = false;
            for (let i = 0; i < allPriceCategories[winner.priceType].winners.length; i++) {
                if (allPriceCategories[winner.priceType].winners[i].Id == winner.Id) {
                    allPriceCategories[winner.priceType].winners.splice(i, 1);
                    isRemoved = true;
                    break;
                }
            }

            if (isRemoved) {
                allPriceCategories[winner.priceType].priceLimit++;
                updatePriceLimitInput(winner.priceType);

                let removeButton = event.srcElement;
                let winnerCard = removeButton.parentNode;
                let winnerList = winnerCard.parentNode;
                winnerList.removeChild(winnerCard);

                showGenerateButtonOfPriceType(winner.priceType);
            }
        }

        function updateWinnerList() {
            let priceContainer = document.getElementsByClassName("grid-container")[currentPriceType];
            let winners = allPriceCategories[currentPriceType].winners;
            let newWinner = createWinnerInfoCard({
                Id: winners[winners.length - 1].Id,
                Fullname: winners[winners.length - 1].Fullname,
                priceType: currentPriceType
            });

            newWinner.style.backgroundColor = getComputedStyle(priceContainer).getPropertyValue("border-color");

            let winnerList = priceContainer.getElementsByClassName("winner-list")[0];
            winnerList.appendChild(newWinner);

            allPriceCategories[currentPriceType].priceLimit--;
            updatePriceLimitInput(currentPriceType);

            if (Number(allPriceCategories[currentPriceType].priceLimit) == 0)
                disableAfterRoll(priceContainer);
        }

        function updatePriceLimitInput(priceType) {
            document.getElementsByClassName("winner-limit")[priceType].value = allPriceCategories[priceType].priceLimit;
        }

        function createRemoveWinnerButton(winner) {
            let removeWinnerButton = document.createElement("div");
            removeWinnerButton.className = "remove-winner-button";

            removeWinnerButton.addEventListener("click", function () {
                removeWinnerFromList(event, winner);
            });

            return removeWinnerButton;
        }

        function createWinnerInfoCard(winner) {
            let winnerCard = document.createElement("div");
            winnerCard.className = "winner-card";

            let newWinnerInfo = document.createElement("div");

            let newWinnerId = document.createElement("span");
            newWinnerId.innerHTML = winner.Id;
            newWinnerId.className = "id";

            let newWinnerFullname = document.createElement("span");
            newWinnerFullname.innerHTML = winner.Fullname;
            newWinnerFullname.style.display = "block";

            newWinnerInfo.appendChild(newWinnerFullname);
            newWinnerInfo.appendChild(newWinnerId);

            winnerCard.appendChild(newWinnerInfo);

            let removeWinnerButton = createRemoveWinnerButton(winner);
            winnerCard.appendChild(removeWinnerButton);

            winnerCard.addEventListener("mouseleave", function () {
                removeWinnerButton.innerHTML = "";
            });

            winnerCard.addEventListener("mouseenter", function () {
                removeWinnerButton.innerHTML = "x";
            });

            return winnerCard;
        }

        function disableAfterRoll(container) {
            let generateButtons = container.getElementsByClassName("generate-button");
            for (let generateButton of generateButtons) {
                generateButton.style.display = "none";
            }
        }

        function hideSuccessExcelImportMessage() {
            let importMessage = document.getElementById("excel-import-message");
            importMessage.style.display = "none";
        }

        function showSuccessExcelImportMessageWithParticipantAmount(participantSize) {
            let importMessage = document.getElementById("excel-import-message");
            importMessage.style.display = "block";
            importMessage.innerHTML = `Successfully imported ${participantSize} participants!`;
        }

        function showTitleInputMessage() {
            let titleMessage = document.getElementById("title-input-message");
            let titleInput = document.getElementById("title-input");
            titleMessage.style.display = "block"
            titleMessage.innerHTML = titleInput.value;
        }

        function hideTitleInput() {
            let titleInputMessage = document.getElementById("title-input");
            titleInputMessage.style.display = "none";
        }


        function hideCurrentWinnerOverlay() {
            overlay.style.display = "none";
            document.getElementById("ok-overlay").style.display = "none";
            hideCoinRain();
            hideFirework();
        }

        function showOverlay() {
            overlay.style.display = "block";
        }

        function showFirework() {
            continueFirework = true;
            updateFirework();
        }

        function hideFirework() {
            continueFirework = false;
        }

        function showCoinRain() {
            continueCoinRain = true;
            updateCoinRain();
        }

        function hideCoinRain() {
            continueCoinRain = false;
        }

        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        function loadDataOnFile() {
            let dataArray = [];
            for (let i of allPriceCategories) {
                dataArray.push(i.winners);
            }
            let string = "";
            let id = "ID" + "\n";
            let fullName = "Full Name" + "\t" + "\t" + "\t";
            for (let i = 0; i < dataArray.length; i++) {
                string += allPriceCategories[i].priceName + ":" + "\n";
                string += fullName + id;
                for (let j = 0; j < dataArray[i].length; j++) {
                    string += dataArray[i][j].Fullname + "\t" + dataArray[i][j].Id + "\n";
                }
                string += "\n" + "============================================" + "\n";
            }
            return string;
        }

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        // Start file download.
        document.getElementById("export").addEventListener("click", function () {
            // Generate download of hello.txt file with some content
            var text = loadDataOnFile();
            var filename = "PriceData.txt";

            download(filename, text);
        }, false);

        function hideAxonActiveLogo() {
            document.getElementById("axon-active-logo").style.display = "none";
        }
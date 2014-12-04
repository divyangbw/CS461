angular.module('reports.factory')

    .factory('MockFactory', function ($q) {

        var castMock = [
            {
                id:"02cd42af-7ced-474e-b965-dcd3693bd538",
                company: "CBS",
                date: new Date(2013, 01, 01)

            },
            {
                id:"7c0e48db-03e6-4c69-eb3a-7de2cd639cfb",
                company: "NBC",
                date: new Date(2013, 02, 01)
            },
            {
                id:"66794d7c-b8a3-45d0-de7f-319e556de34d",
                company: "CNN",
                date: new Date(2013, 02, 01)
            }
        ];

        var segmentMock = [
            {
                id:"333f0f32-a418-4183-95b9-a13ee4ca0ecd",
                castId: "02cd42af-7ced-474e-b965-dcd3693bd538",
                start: "01:23:100",
                end: "02,23:100",
                subject: "Obamacare"
            },
            {
                id:"3f50df13-7466-41ac-942e-7f0c8bef0cea",
                castId: "02cd42af-7ced-474e-b965-dcd3693bd538",
                start: "04:12:000",
                end: "10,12:000",
                subject: "Elections"
            },
            {
                id:"f0c4a940-0a85-40de-c6d4-ec69a058b2e1",
                castId: "02cd42af-7ced-474e-b965-dcd3693bd538",
                start: "01:12:000",
                end: "10,12:000",
                subject: "Republican Canidate"

            },
            {
                id:"4659d36d-5942-460c-c931-cf0e00fcfd8a",
                castId: "7c0e48db-03e6-4c69-eb3a-7de2cd639cfb",
                start: "04:12:000",
                end: "08,12:000",
                subject: "Obamacare"
            },
            {
                id:"181760b3-61d9-47c8-fc18-92681337c0e4",
                castId: "66794d7c-b8a3-45d0-de7f-319e556de34d",
                start: "06:00:000",
                end: "07,00:000",
                subject: "Democratic Canidate"
            }
        ];

        var questionTypeMock = [
            {
                id:"d174335f-7e41-45b1-b735-8262dfa90bab",
                val: "Single Line"
            },
            {
                id:"27b13327-7308-4568-b977-3d13b997c689",
                val: "Multiple Choice"
            },
            ,
            {
                id:"d9d43680-23b6-4c5c-ad2e-e91c2abb5964",
                val: "Multi-Choice"
            }
        ];

        var questionMock = [
            {
                id: "ed2bd18e-72a7-41bb-92a9-705ee2e40ab3",
                type: "d174335f-7e41-45b1-b735-8262dfa90bab",
                tag: "TC1",
                text: "What's your name?",
                section: 1
            },
            {
                id: "c8f63c92-5037-4c57-cec8-fa7aa6d3089d",
                type: "d174335f-7e41-45b1-b735-8262dfa90bab",
                tag: "TC2",
                text: "Where do you live?",
                section: 1
            },
            {
                id: "113d0b72-6f25-4d43-dc24-d99c434aeac0",
                type: "27b13327-7308-4568-b977-3d13b997c689", //Multiple Choice
                tag: "TC3",
                text: "What's your gender?",
                section: 1
            },
            {
                id: "76e9ce7a-0c7a-4df7-92b9-e7880ad50428",
                type: "d9d43680-23b6-4c5c-ad2e-e91c2abb5964", //Multichoice
                tag: "TC4",
                text: "Which of these do you like?",
                section: 2
            }
        ];

        var option = [
            {
                id:"27b13327-7308-4568-b977-3d13b997c689",
                text:"Male"
            },
            {
                id:"27b13327-7308-4568-b977-3d13b997c689",
                text:"Female"
            },
            {
                id:"27b13327-7308-4568-b977-3d13b997c689",
                text:"Other"
            },
            {
                id:"76e9ce7a-0c7a-4df7-92b9-e7880ad50428",
                text:"Milk"
            },
            {
                id:"76e9ce7a-0c7a-4df7-92b9-e7880ad50428",
                text:"Butter"
            },
            {
                id:"76e9ce7a-0c7a-4df7-92b9-e7880ad50428",
                text:"Waffle"
            },
            {
                id:"76e9ce7a-0c7a-4df7-92b9-e7880ad50428",
                text:"Juice"
            }
        ];

        var usersMock = [
            {}
        ];



        return {


            get: function(source, id, optionId) {

                if(!source) {
                    console.log("Source is required. Got NULL");
                    return null
                }
                if(source === "option" && !id) console.log("Id is required if source = option. Got NULL");

                if(source === "cast") {
                    return id === null || id === undefined ? castMock : search(castMock, id);
                } else if (source === "segment") {
                    return id === null || id === undefined ? segmentMock : searchMany(segmentMock, id, "castId");
                } else if (source === "question") {
                    return id === null || id === undefined ? questionMock : search(questionMock, id);
                } else if (source === "questionType") {
                    return id === null || id === undefined ? questionTypeMock : search(questionTypeMock, id);
                } else if (source === "option") {
                    return optionId === null || optionId === undefined ? searchMany(option, id, "question")
                        : search(option, optionId);
                }

                console.log("Got invalid source: " + source);
                return [];
            },

            add: function(source, item) {
                if(!source || !item) {
                    console.log("Source AND Item are required. Got NULL");
                    return null
                }
                item.id = generateUUID();
                if(source === "cast") castMock.push(item);
                else if(source === "segment") segmentMock.push(item);
                else if(source === "question") questionMock.push(item);
                else if(source === "questionType") questionTypeMock.push(item);
                else if(source === "option") option.push(item);
                return item;
            },

            addMany: function(source, items) {
                if(!source|| !items) {
                    console.log("Source is required. Got NULL");
                    return null
                }
                multiIdCreate(items);
                if(source === "cast") castMock.push(items);
                else if(source === "segment") segmentMock.push(items);
                else if(source === "question") questionMock.push(items);
                else if(source === "questionType") questionTypeMock.push(items);
                else if(source === "option") option.push(items);
                return items;
            },

            update: function(source, item) {
                if(source === "cast") update(castMock, item);
                else if(source === "segment") update(segmentMock, item);
                else if(source === "question") update(questionMock, item);
                else if(source === "questionType") update(questionTypeMock, item);
                else if(source === "option") update(option, item);
                return item;
            },

            del: function (source, item) {
                if (source === "question") del(question);
            }

        };

        function search(object, id) {
            for (var i = 0; i < object.length; i++) {
                if (object[i].id === id) return object[i]
            }
        }

        function searchMany(object, id, searchTag) {
            var results = [];
            for (var i = 0; i < object.length; i++) {
                if (object[i][searchTag] === id) results.push(object[i]);
            }
            return results;
        }

        function multiIdCreate(items) {
            for (var i = 0; i < items.length; i++)
                items[i].id = generateUUID();
        }

        function update(object, item) {
            for (var i = 0; i < object.length; i++ ) {
                if (object[i].id === item.id) object[i] = item;
            }
        }

        function generateUUID() {
            var d = Date.now();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                var toReturn = (c=='x' ? r : (r&0x7|0x8)).toString(16);
                return toReturn;
            });
            return uuid;
        }

        function del(question) {

            var index = -1;
            for (var i = 0; i < questionMock.length; i++) {
                if (questionMock[i].id === question.id) {
                    index = i;
                    break;
                }
            }

            questionMock.splice(index, 1);

        }


    });
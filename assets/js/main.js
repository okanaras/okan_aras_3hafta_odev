$(document).ready((e) => {
  console.log("DOMContentLoaded:(");

  let btnAddTask = $("#btnAddTask");
  let taskListElement = $("#task-list");
  let completedListElement = $("#completed-tasks");
  let btnDone = $("#btnDone");
  let btnRemove = $("#btnRemove");
  let btnSelectAll = $("#btnSelectAll");
  let btnClearList = $("#btnClearList");

  let taskLists = JSON.parse(localStorage.getItem("taskLists"));

  if (taskLists == null) {
    taskLists = [];
  }

  let completedList = JSON.parse(localStorage.getItem("completedList"));

  if (completedList == null) {
    completedList = [];
  }

  listele(taskLists, taskListElement, true);
  listele(completedList, completedListElement);

  // click add task button
  $(btnAddTask).click((e) => {
    let newTaskInput = $("#inputNewTask");
    let newTask = newTaskInput.val().trim();
    let isNewTaskNull = newTaskInput.val() === "";

    let isAdded = taskLists.includes(newTask);

    if (isAdded) {
      alert("bu task daha once eklenmistir");
    } else if (isNewTaskNull) {
      alert("bos veri eklenemez");
    } else {
      taskLists.unshift(newTask);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));

      listele(taskLists, taskListElement, true);
    }
  });

  // click tamamlandi button
  $(btnDone).click((e) => {
    let checkboxes = $(".checkbox-element:checked");

    checkboxes.each((index, value) => {
      let label = $(value).parent().find("label");
      let labelElement = $(value).parent().find("label").text();

      let isWantedLabel = label.attr("wanted-label");

      let isTaskAdded = completedList.includes(labelElement);

      if (isTaskAdded) {
        alert("Bu task daha once tamamlanma listesine eklenmis");
      } else if (isWantedLabel) {
        taskLists.splice(labelElement, 1);
        localStorage.setItem("taskLists", JSON.stringify(taskLists));
        listele(taskLists, taskListElement, true);

        completedList.unshift(labelElement);
        localStorage.setItem("completedList", JSON.stringify(completedList));
        listele(completedList, completedListElement);
      }
    });
  });

  // click remove button
  $(btnRemove).click((e) => {
    let checkboxes = $("[type ='checkbox']:checked");

    checkboxes.each((index, value) => {
      let labelElement = $(value).parent().find("label").text();

      taskLists.splice(labelElement, 1);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      listele(taskLists, taskListElement, true);
    });
  });

  // checked all checkbox
  btnSelectAll.click(function () {
    let checkboxes = $(".checkbox-element");
    checkboxes.prop("checked", checkboxes.prop("checked"));
  });

  // click trash icon events
  $("body").click((e) => {
    let element = e.target;

    if (element.id.includes("btnTrashTask")) {
      let silinecekID = element.id;
      taskLists.splice(silinecekID, 1);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      listele(taskLists, taskListElement, true);
    }
  });

  // clear completed task
  $(btnClearList).click((e) => {
    completedList = [];
    localStorage.setItem("completedList", JSON.stringify(completedList));
    listele(completedList, completedListElement);
  });

  // listele function
  function listele(list, listElement, isCompleted = false) {
    listElement.html("");

    if (list.length < 1) {
      listElement.html("<span class='bg-warning p-2'>Listede task yok</span>");
    }

    $.each(list, (index, value) => {
      let liElement = $('<li class="list-group-item"></li>');
      let wrapperDivElemen = $(
        '<div class="d-flex align-items-center justify-content-between"></div>'
      );
      let formCheckDivElement = $('<div class="form-check"></div>');
      let inputCheckElement = $(
        `<input type="checkbox" class="form-check-input checkbox-element" id="task-${index}" data-id="${index}">${value}`
      );
      let labelElement = $(
        `<label class="form-check-label" for="task-${index}" id="task-${index}" wanted-label="true">${value}</label>`
      );
      let spanElement = $("<span></span>");
      let iElement = $(
        `<i class="bi bi-trash-fill text-primary fs-4" id="btnTrashTask" data-id="${index}"></i>`
      );

      if (isCompleted) {
        spanElement.append(iElement);
        formCheckDivElement.append(inputCheckElement);
      }
      formCheckDivElement.append(labelElement);
      wrapperDivElemen.append(formCheckDivElement);
      wrapperDivElemen.append(spanElement);
      liElement.append(wrapperDivElemen);
      listElement.append(liElement);
    });
  }
});

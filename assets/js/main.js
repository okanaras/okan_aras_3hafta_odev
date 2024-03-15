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
  let completedList = JSON.parse(localStorage.getItem("completedList"));

  if (taskLists == null) {
    taskLists = [];
  }
  if (completedList == null) {
    completedList = [];
  }

  listele(taskLists, taskListElement, true);
  listele(completedList, completedListElement);

  // click add task button
  btnAddTask.click((e) => {
    let newTaskInput = $("#inputNewTask");
    let newTask = newTaskInput.val().trim();
    let isNewTaskNull = newTaskInput.val() === "";

    let isAdded = taskLists.includes(newTask);

    if (isAdded) {
      alert("bu task daha once eklenmistir");
    } else if (isNewTaskNull) {
      alert("bos task eklenemez");
    } else {
      taskLists.unshift(newTask);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));

      listele(taskLists, taskListElement, true);
    }
  });

  // click tamamlandi button
  btnDone.click((e) => {
    let checkboxes = $(".checkbox-element:checked");

    checkboxes.each((index, value) => {
      let addedName = $(value).attr("data-name");
      let isTaskAdded = completedList.includes(addedName);
      let isWantedTask = $(value).attr("wanted-task");

      if (isTaskAdded) {
        alert(
          `'${addedName}' taski zaten daha once tamamlanma listesine eklenmis`
        );
      } else if (isWantedTask) {
        completedList.unshift(addedName);
        localStorage.setItem("completedList", JSON.stringify(completedList));
        listele(completedList, completedListElement);
      }

      taskLists = taskLists.filter((task) => task !== addedName);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      listele(taskLists, taskListElement, true);
    });
  });

  // click remove button
  btnRemove.click((e) => {
    let checkboxes = $(".checkbox-element:checked");

    checkboxes.each((index, value) => {
      let silinecekName = $(value).attr("data-name");

      taskLists = taskLists.filter((task) => task !== silinecekName);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      listele(taskLists, taskListElement, true);
    });
  });

  // checked all checkbox
  btnSelectAll.click((e) => {
    let checkboxes = $(".checkbox-element");
    checkboxes.prop("checked", checkboxes.prop("checked"));
  });

  // click trash icon events
  $("body").click((e) => {
    let element = e.target;

    if (element.id.includes("btnTrashTask")) {
      let silinecekID = $(element).attr("data-id");

      taskLists.splice(silinecekID, 1);
      localStorage.setItem("taskLists", JSON.stringify(taskLists));
      listele(taskLists, taskListElement, true);
    }
  });

  // clear completed task
  btnClearList.click((e) => {
    completedList = [];
    localStorage.setItem("completedList", JSON.stringify(completedList));
    listele(completedList, completedListElement);
  });

  // listele function
  function listele(list, listElement, isCompleted = false) {
    listElement.html("");

    if (list.length < 1) {
      listElement.html(
        "<span class='bg-warning p-2 rounded-1'>Listede task yok</span>"
      );
    }

    $.each(list, (index, value) => {
      let liElement = $('<li class="list-group-item"></li>');
      let wrapperDivElemen = $(
        '<div class="d-flex align-items-center justify-content-between"></div>'
      );
      let formCheckDivElement = $('<div class="form-check"></div>');
      let inputCheckElement = $(
        `<input type="checkbox" class="form-check-input checkbox-element" id="task-${index}" data-name="${value}" wanted-task="true">${value}`
      );
      let labelElement = $(
        `<label class="form-check-label" for="task-${index}">${value}</label>`
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

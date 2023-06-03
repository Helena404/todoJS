//находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList =  document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task)=>renderTask(task));
}

checkEmptyList();

//добавление задачи
form.addEventListener('submit', addTask);

//удаление задачи
tasksList.addEventListener('click',deleteTask);

//задача выполнена
tasksList.addEventListener('click',doneTask);


//функции
function addTask(event) {
	//отменяем отправку формы, перезагрузку страницы
	event.preventDefault();

	//достаем текст из формы
	const taskText = taskInput.value;

	//описываем задачу в виде объекта
	const newTask = {
		id:Date.now(),
		text: taskText,
		done: false
	}

	//Добавляем объект в массив с объектами
	tasks.push(newTask);

	//сохраняем задачу в хранилище браузера localStorage
	saveToLS();

	renderTask(newTask);

	//очищаем поле ввода и возвращаем на него фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();

	
}

function deleteTask(event){
	//проверяем, что клик был по кнопке delete
	if(event.target.dataset.action !== 'delete') return;

	const parentNode = event.target.closest('.list-group-item');

	//определяем id задачи
	const id = Number(parentNode.id);
	
	//удаление через filter()
	tasks = tasks.filter((task)=>task.id !==id);

		/*//находим индекс задачи в массиве
		const index = tasks.findIndex((task)=>task.id === id);
		
		//удаляем задачу из массива
		tasks.splice(index,1);*/

	parentNode.remove();

	//сохраняем задачу в хранилище браузера localStorage
	saveToLS();

	checkEmptyList();
}

function doneTask(event){
	//проверяем, что клик был по кнопке done
	if(event.target.dataset.action !== 'done') return;
	
	const parentNode = event.target.closest('.list-group-item');
	const id = Number(parentNode.id);
	const task = tasks.find((task)=>task.id === id);
	task.done = !task.done;

	//сохраняем задачу в хранилище браузера localStorage
	saveToLS();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}


function checkEmptyList(){
if (tasks.length === 0) {
	const EmptyListElement = `<li id="emptyList" class="list-group-item empty-list">
								<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
								<div class="empty-list__title">Список дел пуст</div>
							</li>`
	tasksList.insertAdjacentHTML('afterbegin', EmptyListElement);
}
if (tasks.length > 0) {
	const emptyListEl = document.querySelector('#emptyList');
	emptyListEl ? emptyListEl.remove() : null;
}
}

function saveToLS(){
	localStorage.setItem('tasks',JSON.stringify(tasks));
}

function renderTask(task){
	//формируем css класс
	const cssClass = (task.done) ? "task-title task-title--done": "task-title";

	//формируем разметку для новой задачи
	const taskHtml= `
					<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
						<span class="${cssClass}">${task.text}</span>
						<div class="task-item__buttons">
							<button type="button" data-action="done" class="btn-action">
								<img src="./img/tick.svg" alt="Done" width="18" height="18">
							</button>
							<button type="button" data-action="delete" class="btn-action">
								<img src="./img/cross.svg" alt="Done" width="18" height="18">
							</button>
						</div>
					</li>`

	//добавить задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHtml);
}
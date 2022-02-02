import {
    add, eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    fromUnixTime, getDate, getMonth,
    getUnixTime, isSameDay,
    startOfMonth,
    startOfWeek,
    sub
} from 'date-fns'

const datePickerButton = document.querySelector('.date-picker-button')
const datePicker = document.querySelector('.date-picker')
const datePickerHeaderText = datePicker.querySelector('.current-month')
const datePickerDates = datePicker.querySelector('.date-picker-grid-dates')
let currentDate = new Date()

// setDateInButton вызывается каждый раз, когда надо:
// - установить текст даты в кнопке
// - установить хранимое в data-attr кол-во м-секунд, выбранное в ручную (или при инициализации страницы)
function setDateInButton(date) {
    datePickerButton.innerText = format(date, 'PPP')
    datePickerButton.dataset.selectedDate = getUnixTime(date)
    datePickerDates.innerHTML = ''
}
setDateInButton(currentDate)

datePickerButton.addEventListener('click', () => {
    datePicker.classList.toggle('show')

    const selectedDate = fromUnixTime(datePickerButton.dataset.selectedDate)
    currentDate = selectedDate
    setupDatePicker(selectedDate)
})

// принимает дату и инициализирует развернутый календарь, а именно:
// - навешивает название месяца и год в хэдере
// - навешивает обработчик клика на даты
function setupDatePicker(receivedDate) {
    datePickerHeaderText.innerText = format(currentDate, 'LLLL - yyyy')
    renderDates(receivedDate)
}

// Рендер дат календаря
function renderDates(receivedDate) {
    datePickerDates.innerHTML = ''
    const firstWeekStart = startOfWeek(startOfMonth(receivedDate))
    const lastWeekEnd = endOfWeek(endOfMonth(receivedDate))
    const dates = eachDayOfInterval({
        start: firstWeekStart,
        end: lastWeekEnd
    })

    if (!dates) return
    dates.forEach( date => {
        //
        const dateButton = document.createElement('button')
        dateButton.classList.add('date')
        dateButton.innerText = getDate(date)
        if (getMonth(date) !== getMonth(receivedDate)) {
            dateButton.classList.add('date-picker-other-month-date')
        }
        let selectedDate = fromUnixTime(datePickerButton.dataset.selectedDate)
        if (isSameDay(date, selectedDate)) {
            dateButton.classList.add('selected')
        }

        // клик по дате который
        // - сменить дату внутри главной кнопки;
        // - закроет окно
        dateButton.addEventListener('click', () => {
            setDateInButton(date)
            datePicker.classList.remove('show')
        })
        datePickerDates.appendChild(dateButton)
    })
}

// Слушатели стрелок
// для перемещения используется фактическая дата, у которой прибавляется месяц
datePicker.addEventListener('click', e => {
    if (e.target.matches('.prev-month-button')) {
        currentDate = sub(currentDate, { months: 1 })
        setupDatePicker(currentDate)
    }
    if (e.target.matches('.next-month-button')) {
        currentDate = add(currentDate, { months: 1 })
        setupDatePicker(currentDate)
    }
})
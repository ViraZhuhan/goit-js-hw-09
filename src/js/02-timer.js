import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/material_green.css');
import Notiflix from 'notiflix';

const refs = {
  inputEl: document.getElementById('datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const currentTime = new Date();
    if (selectedDates[0] - currentTime <= 0) {
      refs.startBtn.disabled = true;
      Notiflix.Notify.failure('Enter the date in the future', {
        timeout: 1000,
        width: '300px',
      });
    } else {
      refs.startBtn.disabled = false;
    }
  },
};
const flatPickr = flatpickr(refs.inputEl, options);

refs.startBtn.addEventListener('click', onStartTimerClick);
refs.stopBtn.addEventListener('click', onStopTimerClick);

function onStartTimerClick() {
  options.onClose;
  timer.start();
}

function onStopTimerClick() {
  timer.stop();
}

function upDateClockFace({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = days;
  refs.dataHours.textContent = hours;
  refs.dataMinutes.textContent = minutes;
  refs.dataSeconds.textContent = seconds;
}



const timer = {
  intervalID: null,
  isActive: false,
  start() {
    if (this.isActive) {
      return
    }
    this.intervalID = setInterval(() => {
      const currentTime = Date.now();
      this.isActive = true;
      refs.startBtn.disabled = true;

      const time = convertMs(
        flatPickr.selectedDates[0] - currentTime
      );
      if(flatPickr.selectedDates[0] - currentTime > 0) {
         upDateClockFace(time);
      }
      else {
      clearInterval(this.intervalID);
      refs.startBtn.disabled = false;
    }
    }, 1000);
    
  },
  stop() {
    clearInterval(this.intervalID);
    const time = convertMs(0);
    upDateClockFace(time);
    refs.startBtn.disabled = false;
    refs.stopBtn.disabled = true;
  },
};

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

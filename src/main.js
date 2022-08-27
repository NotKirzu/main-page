import App from './App.svelte'

import { create as createConfetti } from 'canvas-confetti';
import { differenceInYears } from 'date-fns';
import feather from 'feather-icons';

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';;

const app = new App({
  target: document.getElementById('app'),
  props: {
    differenceInYears,
    createConfetti,
    bootstrap,
    feather
  }
})

export default app

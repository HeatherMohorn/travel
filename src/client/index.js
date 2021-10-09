import './styles/style.scss'

import {performAction} from './js/functions';

document.getElementById('generate').addEventListener('click', performAction);

export{
  performAction
}

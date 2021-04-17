import axios from 'axios';
import { getEnvironment } from '../config/environment';

const { apiURL } = getEnvironment();

export const api = axios.create({ baseURL: apiURL });

import axios from 'axios';
import { getConfig } from '@/config/environment';

const { apiURL } = getConfig();

export const api = axios.create({ baseURL: apiURL });

import '../controllers/AdminController';
import { RouterConfigs } from '../core/router';

@RouterConfigs({
  baseUrl: '/sys-admin',
  mergeParams: true,
})
export class AdminRouter {}

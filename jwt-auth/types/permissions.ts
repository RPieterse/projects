export interface PermissionModel {
  path: string;
  roles: { role: string; methods: string[] }[];
}

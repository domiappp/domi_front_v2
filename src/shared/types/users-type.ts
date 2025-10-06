export type Rol = 'administrador' | 'comercio' | 'cliente'; // ajusta según tu backend

export type User = {
  id: number;
  email: string;
  rol: Rol;
};

export type LoginSuccess = {
  ok: true;
  user: User;
  rol: Rol;
  modules: string[];   // 👈 libre, cualquier string
};

export type LoginError = {
  ok: false;
  message: string;
};

export type LoginResponse = LoginSuccess | LoginError;

export type LoginPayload = {
  email: string;
  password: string;
};


// Tipos base
export type UserList = {
  id: number;
  name: string;
  email: string;
  rol: Rol;                              // importa tu enum Rol
  estado: 'activo' | 'inactivo';
  direccion?: string;
  telefono?: string;
  created_at: string;                    // ISO string
  updated_at: string;                    // ISO string
};

// Crear: todo igual que UserList pero sin id/fechas
export type CreateUserPayload = Omit<UserList, 'id' | 'created_at' | 'updated_at'>;

// Actualizar: parcial de lo que se puede cambiar
export type UpdateUserPayload = Partial<
  Omit<UserList, 'id' | 'created_at' | 'updated_at'>
>;

// Toggle estado: útil para el hook específico
export type ToggleEstadoPayload = {
  estado: UserList['estado'];
};

// (Opcional) Respuesta paginada de tu API
export type UsersResponse = {
  meta: { page: number; limit: number; total: number; totalPages: number };
  items: UserList[];
};

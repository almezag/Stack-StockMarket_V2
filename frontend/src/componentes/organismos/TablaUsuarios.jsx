import Boton from '../atomos/Boton.jsx';

export default function TablaUsuarios({ usuarios, alEditar, alEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle" aria-label="Usuarios administrados">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(function mostrarUsuario(usuario) {
            function editarUsuario() {
              alEditar(usuario);
            }
            function eliminarUsuario() {
              alEliminar(usuario.id);
            }
            return (
              <tr key={usuario.id}>
                <th scope="row">{usuario.nombre}</th>
                <td>{usuario.correo}</td>
                <td>{usuario.rol === 'administrador' ? 'Administrador' : 'Cliente'}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Boton alPresionar={editarUsuario} etiquetaAccesible={`Editar ${usuario.nombre}`}>
                      Editar
                    </Boton>
                    <Boton
                      alPresionar={eliminarUsuario}
                      clase="btn btn-outline-danger"
                      etiquetaAccesible={`Eliminar ${usuario.nombre}`}
                    >
                      Eliminar
                    </Boton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {usuarios.length === 0 && <p>No hay usuarios registrados.</p>}
    </div>
  );
}

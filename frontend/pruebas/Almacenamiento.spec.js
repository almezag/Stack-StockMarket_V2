import { guardarDatos, leerDatos, sanearCarrito, sanearProductos } from '../src/servicios/almacenamientoLocal.js';
import { calcularTotales } from '../src/utilidades/calcularTotales.js';
import { productosIniciales } from '../src/datos/productosIniciales.js';

beforeEach(function prepararAlmacenamiento() {
  localStorage.clear();
});
afterEach(function limpiarAlmacenamiento() {
  localStorage.clear();
});

describe('Persistencia local defensiva', function describirPersistencia() {
  it('lee y escribe mediante Storage inyectado sin tocar el catálogo heredado', function comprobarStorageInyectado() {
    const almacenamiento = jasmine.createSpyObj('almacenamiento', ['getItem', 'setItem']);
    almacenamiento.getItem.and.returnValue('[{"id":1,"cantidad":2}]');
    expect(leerDatos('carrito-prueba', [], almacenamiento)).toEqual([{ id: 1, cantidad: 2 }]);
    expect(guardarDatos('carrito-prueba', [], almacenamiento)).toBeTrue();
    expect(almacenamiento.setItem).toHaveBeenCalledWith('carrito-prueba', '[]');
    expect(localStorage.length).toBe(0);
  });

  it('devuelve respaldo para clave ausente, JSON inválido y Storage que lanza errores', function comprobarRespaldo() {
    const almacenamiento = jasmine.createSpyObj('almacenamiento', ['getItem', 'setItem']);
    almacenamiento.getItem.and.returnValue(null);
    expect(leerDatos('prueba', [], almacenamiento)).toEqual([]);
    almacenamiento.getItem.and.returnValue('{');
    expect(leerDatos('prueba', [], almacenamiento)).toEqual([]);
    almacenamiento.getItem.and.throwError('Denegado');
    almacenamiento.setItem.and.throwError('Sin espacio');
    expect(leerDatos('prueba', [], almacenamiento)).toEqual([]);
    expect(guardarDatos('prueba', [], almacenamiento)).toBeFalse();
  });

  it('rechaza catálogos inválidos y duplicados pero preserva un catálogo vacío válido', function comprobarCatalogo() {
    const productoValido = productosIniciales[0];
    const datosInvalidos = [
      null, {}, [null], [{ ...productoValido, id: -1 }],
      [{ ...productoValido, nombre: ' ' }], [{ ...productoValido, categoria: '' }],
      [{ ...productoValido, precio: -1 }], [{ ...productoValido, precio: Infinity }],
      [{ ...productoValido, descripcion: null }], [{ ...productoValido, emoji: null }],
      [productoValido, productoValido]
    ];
    datosInvalidos.forEach(function comprobarListaInvalida(datos) {
      expect(sanearProductos(datos, productosIniciales)).toBe(productosIniciales);
    });
    expect(sanearProductos([], productosIniciales)).toEqual([]);
    expect(sanearProductos([{ ...productoValido, campoExtra: 'ignorado' }], [])).toEqual([productoValido]);
  });

  it('rechaza carrito no listado, cantidades inseguras e identificadores de tipo incorrecto', function comprobarEstructuras() {
    expect(sanearCarrito({}, productosIniciales)).toEqual([]);
    expect(sanearCarrito([
      { id: '1', cantidad: 1 }, { id: 1, cantidad: Infinity },
      { id: 1, cantidad: Number.MAX_SAFE_INTEGER + 1 }, { id: 999, cantidad: 1 }
    ], productosIniciales)).toEqual([]);
    const datos = [{ id: 1, cantidad: Number.MAX_SAFE_INTEGER }, { id: 1, cantidad: 1 }];
    expect(sanearCarrito(datos, productosIniciales)).toEqual([{ id: 1, cantidad: Number.MAX_SAFE_INTEGER }]);
    expect(datos[0].cantidad).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('Política original de envío', function describirEnvio() {
  it('cobra $2.990 justo debajo del umbral y aplica envío gratis desde $25.000', function comprobarUmbral() {
    expect(calcularTotales([{ producto: { precio: 24999 }, cantidad: 1 }]))
      .toEqual({ subtotal: 24999, envio: 2990, total: 27989 });
    expect(calcularTotales([{ producto: { precio: 25000 }, cantidad: 1 }]))
      .toEqual({ subtotal: 25000, envio: 0, total: 25000 });
    expect(calcularTotales([{ producto: { precio: 25001 }, cantidad: 1 }]).envio).toBe(0);
  });
});

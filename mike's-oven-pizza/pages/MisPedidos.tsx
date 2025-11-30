import React, { useEffect, useState } from 'react';

interface DetallePedido {
  detalleId: number;
  nombreProducto: string;
  cantidad: number;
  tamanio?: string;
  subtotal: number;
}

interface Pedido {
  pedidoId: number;
  total: number;
  estado: string;
  fechaPedido: string;
  detalles?: DetallePedido[];
}

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const usuarioId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    fetch(`http://localhost:8080/pedidos/mis-pedidos/${usuarioId}`)
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err));
  }, [usuarioId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul>
          {pedidos.map((p, index) => (
            <li key={p.pedidoId} className="border p-4 mb-2 rounded-lg">
              <p className="font-semibold">Pedido #{index + 1} - Total: S/ {p.total}</p>
              <p>Estado: {p.estado}</p>
              <p>Fecha: {new Date(p.fechaPedido).toLocaleString()}</p>

              {/* Detalles del pedido */}
              {p.detalles && p.detalles.length > 0 && (
                <ul className="ml-4 mt-2 list-disc">
                  {p.detalles.map(d => (
                    <li key={d.detalleId}>
                      {d.cantidad} x {d.nombreProducto} {d.tamanio ? `(${d.tamanio})` : ''} - S/ {d.subtotal}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisPedidos;

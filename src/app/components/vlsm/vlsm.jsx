'use client';
import React, { useState, useEffect } from "react";
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend, CartesianGrid } from "recharts";

export default function SubnetCalculator() {
  const [ipWithPrefix, setIpWithPrefix] = useState("");
  const [subnetCount, setSubnetCount] = useState(0);
  const [subnets, setSubnets] = useState([]);
  const [result, setResult] = useState(null);
  const [calculationSuccess, setCalculationSuccess] = useState(false);
  const [chartData, setChartData] = useState([]);

  const isValidIP = (ip) => {
    if (!ip) return false;
    const cleanIp = ip.trim(); // Eliminar espacios en blanco
    const regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
    return regex.test(cleanIp);
  };

  const handleSubnetCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setSubnetCount(count);
    setSubnets(Array.from({ length: count }, (_, i) => ({ 
      name: `${i + 1}`, 
      hosts: "", 
      prefix: 0,
      hostsAvailable: 0,
      hostsUnused: 0,
      ip: "",
      mask: "",
      broadcast: "",
      startIp: "",
      endIp: ""
    })));
    // Limpiar resultados previos cuando cambia la cantidad de subredes
    setCalculationSuccess(false);
  };

  const handleSubnetChange = (index, field, value) => {
    const updatedSubnets = [...subnets];
    updatedSubnets[index][field] = value;
    setSubnets(updatedSubnets);
    // Limpiar resultados previos cuando cambian los hosts requeridos
    setCalculationSuccess(false);
  };

  const calculateSubnets = () => {
    // Resetear el estado de cálculo
    setCalculationSuccess(false);
    
    // Validar el formato IP/prefix
    const parts = ipWithPrefix.split('/');
    if (parts.length !== 2) {
      setResult({ message: "Error: El formato debe ser IP/prefijo (ej: 192.168.1.0/24)" });
      return;
    }

    const ip = parts[0];
    const prefix = parseInt(parts[1], 10);
    
    if (!isValidIP(ip)) {
      setResult({ message: "Error: Dirección IP no válida." });
      return;
    }

    if (isNaN(prefix) || prefix < 1 || prefix > 32) {
      setResult({ message: "Error: El prefijo debe ser un número entre 1 y 32." });
      return;
    }
    
    // Verificar que todos los hosts tengan valores válidos
    for (const subnet of subnets) {
      const hosts = parseInt(subnet.hosts, 10);
      if (isNaN(hosts) || hosts <= 0) {
        setResult({ message: "Error: Todas las subredes deben tener al menos 1 host." });
        return;
      }
    }
    
    // Calcular hosts totales disponibles
    const totalAvailableHosts = Math.pow(2, 32 - prefix) - 2;
    const totalNeededHosts = subnets.reduce((acc, subnet) => acc + parseInt(subnet.hosts, 10), 0);
    
    if (totalNeededHosts > totalAvailableHosts) {
      setResult({ 
        message: `Error: No hay suficientes hosts disponibles. Se necesitan ${totalNeededHosts} pero solo hay ${totalAvailableHosts} hosts disponibles.` 
      });
      return;
    }
    
    // Ordenar subredes de mayor a menor número de hosts
    const sortedSubnets = [...subnets].sort((a, b) => parseInt(b.hosts, 10) - parseInt(a.hosts, 10));
    
    // Convertir IP a formato numérico para cálculos
    const ipParts = ip.split(".").map(Number);
    let networkNumber = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    
    const calculatedSubnets = [];
    
    for (let i = 0; i < sortedSubnets.length; i++) {
      const subnet = sortedSubnets[i];
      const neededHosts = parseInt(subnet.hosts, 10) + 2; // +2 para red y broadcast
      
      // Calcular bits necesarios para los hosts
      let hostBits = Math.ceil(Math.log2(neededHosts));
      const subnetPrefix = 32 - hostBits;
      
      // Tamaño total de la subred (incluye dirección de red y broadcast)
      const subnetSize = Math.pow(2, hostBits);
      
      // Alinear la dirección de red a un límite de subred
      networkNumber = networkNumber & (~(subnetSize - 1));
      
      // Dirección de red
      const networkAddress = [
        (networkNumber >>> 24) & 255,
        (networkNumber >>> 16) & 255,
        (networkNumber >>> 8) & 255,
        networkNumber & 255
      ].join(".");
      
      // Dirección de broadcast
      const broadcastNumber = networkNumber + subnetSize - 1;
      const broadcastAddress = [
        (broadcastNumber >>> 24) & 255,
        (broadcastNumber >>> 16) & 255,
        (broadcastNumber >>> 8) & 255,
        broadcastNumber & 255
      ].join(".");
      
      // Rango de IPs utilizables (primera y última)
      const firstIP = networkNumber + 1;
      const lastIP = broadcastNumber - 1;
      
      const firstIPAddress = [
        (firstIP >>> 24) & 255,
        (firstIP >>> 16) & 255,
        (firstIP >>> 8) & 255,
        firstIP & 255
      ].join(".");
      
      const lastIPAddress = [
        (lastIP >>> 24) & 255,
        (lastIP >>> 16) & 255,
        (lastIP >>> 8) & 255,
        lastIP & 255
      ].join(".");
      
      // Calcular máscara
      const mask = subnetMask(subnetPrefix);
      
      calculatedSubnets.push({
        ...subnet,
        prefix: subnetPrefix,
        size: subnetSize,
        ip: networkAddress,
        mask: mask,
        broadcast: broadcastAddress,
        startIp: firstIPAddress,
        endIp: lastIPAddress,
        hostsAvailable: subnetSize - 2,
        hostsUnused: subnetSize - 2 - parseInt(subnet.hosts, 10)
      });
      
      // Avanzar a la siguiente subred
      networkNumber = broadcastNumber + 1;
    }
    
    setSubnets(calculatedSubnets);
    setCalculationSuccess(true);
    setResult({
      message: "Subredes calculadas con éxito.",
      totalNeededHosts: totalNeededHosts,
      totalAvailableHosts: totalAvailableHosts
    });
    
    // Actualizar datos para el gráfico
    setChartData([{
      name: ipWithPrefix,
      uv: totalNeededHosts,
      pv: calculatedSubnets.reduce((acc, subnet) => acc + subnet.hostsAvailable, 0),
      amt: totalAvailableHosts
      
      
    }]);
    console.log(`totalAvailableHost: ${totalAvailableHosts}`);
    console.log(`totalNeededHosts: ${totalNeededHosts}`);
    console.log(`subnets: ${calculatedSubnets}`);
    
  };

  // Calcular máscara de subred 
  const subnetMask = (prefix) => {
    return Array(4).fill(0).map((_, i) => {
      if (prefix >= (i + 1) * 8) return 255;
      if (prefix <= i * 8) return 0;
      return 256 - Math.pow(2, 8 - (prefix % 8));
    }).join(".");
  };

  // Extraer el prefijo para calcular hosts totales
  const parts = ipWithPrefix.split('/');
  const prefix = parts.length === 2 ? parseInt(parts[1], 10) : null;
  const totalHostsForNetwork = prefix && !isNaN(prefix) ? Math.pow(2, 32 - prefix) - 2 : 0;

  // Calcular hosts necesitados solo de subredes que tienen un valor válido
  const totalHostsNeeded = subnets.reduce((acc, subnet) => {
    const hosts = parseInt(subnet.hosts, 10);
    return acc + (isNaN(hosts) ? 0 : hosts);
  }, 0);



  return (
    <div className="flex flex-col items-center max-w-lg gap-0 p-4 mx-auto">
      <h1 className="text-2xl font-bold">Calculadora de Subredes con VLSM</h1>
      <p className="text-gray-600">Esta herramienta te ayudará a calcular subredes usando VLSM y entender cómo funcionan.</p>
      <section className="flex flex-col items-center justify-center max-w-lg mt-4">
        <div className="my-4">
          <label className="block">Dirección IP / Prefijo:</label>
          <input 
            type="text" 
            value={ipWithPrefix} 
            onChange={(e) => {
              setIpWithPrefix(e.target.value);
              setCalculationSuccess(false); // Limpiar resultados al cambiar la IP
            }} 
            className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white" 
            placeholder="Ej: 192.168.1.0/24" 
          />
        </div>
        <div className="my-4">
          <label className="block">Cantidad de subredes:</label>
          <input 
            type="number" 
            value={subnetCount} 
            onChange={handleSubnetCountChange} 
            className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white" 
            placeholder="Ej: 3" 
          />
        </div>
        {subnets.map((subnet, index) => (
          <div key={index} className="w-full p-2 my-2 border rounded">
            <label className="block">{subnet.name} - Cantidad de Hosts:</label>
            <input 
              type="number" 
              value={subnet.hosts} 
              onChange={(e) => handleSubnetChange(index, "hosts", e.target.value)} 
              className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white" 
              placeholder="Ej: 50" 
            />
          </div>
        ))}
        <button onClick={calculateSubnets} className="p-2 mt-4 text-white bg-gray-800 rounded">Calcular</button>
      </section>
      
      {result && (
        <div className="w-full px-1 py-4 mt-4 rounded">
          <h4 className="text-xl font-bold">Resultados:</h4>
          <p className="text-sm">{result.message}</p>
          
          {calculationSuccess && (
            <>
              <div className="mt-4">
                <p className="font-extralight">Total de Hosts Necesitados: {totalHostsNeeded}</p>
                <p className="font-extralight">Total de Hosts Disponibles: {totalHostsForNetwork}</p>
                {totalHostsForNetwork > 0 && (
                  <p className="font-extralight">
                    La dirección de red {ipWithPrefix} tiene {totalHostsForNetwork} hosts disponibles.
                  </p>
                )}
              </div>
              
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs text-center border border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-1 border">Nombre</th>
                      <th className="p-1 border">H. Req.</th>
                      <th className="p-1 border">H. Disp.</th>
                      <th className="hidden p-1 border md:table-cell">Hosts No Usados</th>
                      <th className="p-1 border">D. de Red</th>
                      <th className="p-1 border">Máscara</th>
                      <th className="p-1 border">Rango</th>
                      <th className="p-1 border">Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subnets.map((subnet, index) => (
                      <tr key={index}>
                        <td className="p-1 border">{subnet.name}</td>
                        <td className="p-1 border">{subnet.hosts || 0}</td>
                        <td className="p-1 border">{subnet.hostsAvailable || 0}</td>
                        <td className="hidden p-1 border md:table-cell">{subnet.hostsUnused || 0}</td>
                        <td className="p-1 border">{subnet.ip}/{subnet.prefix || 0}</td>
                        <td className="p-1 border">{subnet.mask || ""}</td>
                        <td className="p-1 border">{subnet.startIp && subnet.endIp ? `${subnet.startIp} - ${subnet.endIp}` : ""}</td>
                        <td className="p-1 border">{subnet.broadcast || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {chartData.length > 0 && (
                <div className="mt-4" style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Total Red" dataKey="amt" stackId="b" fill= "#82ca9d"  />
                      <Bar name="Hosts Disponibles" dataKey="pv" stackId="a" fill="#8884d8" />
                      <Bar name="Hosts Necesitados" dataKey="uv" stackId="a" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
    <div className="flex flex-col items-center w-full max-w-5xl gap-6 p-4 mx-auto">
      <div className="flex flex-col items-center w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calculadora VLSM</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Calcula subredes optimizadas usando Máscara de Subred de Longitud Variable.
        </p>
      </div>

      <section className="w-full max-w-lg p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8 bg-white dark:bg-neutral-800">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Dirección IP / Prefijo</label>
          <div className="relative">
             <input 
              type="text" 
              value={ipWithPrefix} 
              onChange={(e) => {
                setIpWithPrefix(e.target.value);
                setCalculationSuccess(false); 
              }} 
              className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white dark:bg-neutral-700 dark:text-white dark:focus:bg-neutral-600" 
              placeholder="Ej: 192.168.1.0/24" 
            />
          </div>
        </div>

        <div>
           <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Cantidad de subredes</label>
           <input 
            type="number" 
            value={subnetCount} 
            onChange={handleSubnetCountChange} 
            className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white dark:bg-neutral-700 dark:text-white dark:focus:bg-neutral-600" 
            placeholder="Ej: 3" 
          />
        </div>

        {subnets.length > 0 && (
          <div className="space-y-3">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Hosts por subred</label>
             <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {subnets.map((subnet, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-gray-600 bg-gray-200 rounded-full dark:bg-neutral-700 dark:text-gray-300 shrink-0">
                    {subnet.name}
                  </span>
                  <input 
                    type="number" 
                    value={subnet.hosts} 
                    onChange={(e) => handleSubnetChange(index, "hosts", e.target.value)} 
                    className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white dark:bg-neutral-700 dark:text-white dark:focus:bg-neutral-600"
                    placeholder="Hosts requeridos" 
                  />
                </div>
              ))}
             </div>
          </div>
        )}

        <button 
          onClick={calculateSubnets} 
          className="block w-full px-5 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Calcular Subredes
        </button>
      </section>
      
      {result && (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!calculationSuccess && result.message && (
             <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-r shadow-sm dark:bg-red-900/30 dark:text-red-200 dark:border-red-500" role="alert">
                <p className="font-bold">Error de Cálculo</p>
                <p>{result.message}</p>
             </div>
          )}

          {calculationSuccess && (
            <>
               <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-neutral-800 dark:border-neutral-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hosts Necesitados</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalHostsNeeded}</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-neutral-800 dark:border-neutral-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hosts Disponibles</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalHostsForNetwork}</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-neutral-800 dark:border-neutral-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Eficiencia</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.round((totalHostsNeeded / totalHostsForNetwork) * 100)}%
                    </p>
                    <span className="text-xs text-gray-400 block px-2 py-0.5 bg-gray-100 rounded-full dark:bg-neutral-700">Aparox.</span>
                  </div>
                </div>
               </div>

                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
                    La red <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 dark:bg-black/20 dark:border-neutral-600">{ipWithPrefix}</span> tiene capacidad suficiente.
                  </p>
                </div>
              
              <div className="mt-6 md:hidden space-y-4">
                {subnets.map((subnet, index) => (
                  <div key={index} className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-neutral-700">
                     <div className="flex justify-between items-center mb-3">
                        <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-800 rounded-full dark:bg-neutral-700 shrink-0">
                          {subnet.name}
                        </span>
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded dark:bg-neutral-700 dark:text-gray-300">
                          {subnet.ip}/{subnet.prefix}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-500 dark:text-gray-400">Hosts Req/Disp</span>
                           <span className="font-medium text-gray-800 dark:text-gray-200">{subnet.hosts} / {subnet.hostsAvailable}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-500 dark:text-gray-400">Máscara</span>
                           <span className="font-mono text-gray-800 dark:text-gray-200">{subnet.mask}</span>
                        </div>
                         <div className="flex flex-col col-span-2">
                           <span className="text-xs text-gray-500 dark:text-gray-400">Rango</span>
                           <span className="font-mono text-gray-800 dark:text-gray-200">{subnet.startIp} - {subnet.endIp}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                           <span className="text-xs text-gray-500 dark:text-gray-400">Broadcast</span>
                           <span className="font-mono text-gray-800 dark:text-gray-200">{subnet.broadcast}</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block mt-6 overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full text-sm text-center border-collapse bg-white dark:bg-neutral-800">
                  <thead className="bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">Nombre</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">H. Req.</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">H. Disp.</th>
                      <th className="hidden p-3 border border-gray-200 dark:border-neutral-600 lg:table-cell font-semibold">Hosts No Usados</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">D. de Red</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">Máscara</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">Rango</th>
                      <th className="p-3 border border-gray-200 dark:border-neutral-600 font-semibold">Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subnets.map((subnet, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transiton-colors">
                        <td className="p-3 border border-gray-200 dark:border-neutral-600">{subnet.name}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600">{subnet.hosts || 0}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600">{subnet.hostsAvailable || 0}</td>
                        <td className="hidden p-3 border border-gray-200 dark:border-neutral-600 lg:table-cell">{subnet.hostsUnused || 0}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600 font-mono text-xs">{subnet.ip}/{subnet.prefix || 0}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600 font-mono text-xs">{subnet.mask || ""}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600 font-mono text-xs whitespace-nowrap">{subnet.startIp && subnet.endIp ? `${subnet.startIp} - ${subnet.endIp}` : ""}</td>
                        <td className="p-3 border border-gray-200 dark:border-neutral-600 font-mono text-xs">{subnet.broadcast || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {chartData.length > 0 && (
                <div className="mt-8" style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                        itemStyle={{ color: "#374151" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar name="Total Red" dataKey="amt" fill="#1f2937" radius={[4, 4, 0, 0]} />
                      <Bar name="Hosts Disponibles" dataKey="pv" fill="#6b7280" radius={[4, 4, 0, 0]} />
                      <Bar name="Hosts Necesitados" dataKey="uv" fill="#d1d5db" radius={[4, 4, 0, 0]} />
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

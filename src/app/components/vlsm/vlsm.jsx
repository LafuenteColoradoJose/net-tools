'use client';
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function SubnetCalculator() {
  const [ipWithPrefix, setIpWithPrefix] = useState("");
  const [subnetCount, setSubnetCount] = useState(0);
  const [subnets, setSubnets] = useState([]);
  const [result, setResult] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const isValidIP = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleSubnetCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setSubnetCount(count);
    setSubnets(Array.from({ length: count }, (_, i) => ({ name: `${i + 1}`, hosts: "", prefix: 0 })));
  };

  const handleSubnetChange = (index, field, value) => {
    const updatedSubnets = [...subnets];
    updatedSubnets[index][field] = value;
    setSubnets(updatedSubnets);
  };

  const calculateSubnets = () => {
    const [ip, prefix] = ipWithPrefix.split('/');
    if (!isValidIP(ip) || isNaN(prefix) || prefix < 0 || prefix > 32) {
      setResult({ message: "Error: Dirección IP o prefijo no válidos." });
      return;
    }
    
    const sortedSubnets = [...subnets].sort((a, b) => parseInt(b.hosts, 10) - parseInt(a.hosts, 10));
    let currentIP = ip;
    const calculatedSubnets = sortedSubnets.map((subnet, index) => {
      const neededHosts = parseInt(subnet.hosts, 10) + 2;
      let subnetPrefix = 32;
      while (Math.pow(2, 32 - subnetPrefix) < neededHosts) {
        subnetPrefix--;
      }
      const assignedIP = currentIP;
      const subnetSize = Math.pow(2, 32 - subnetPrefix);
      
      const ipParts = assignedIP.split(".").map(Number);
      let ipNumber = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
      ipNumber += subnetSize;
      currentIP = [(ipNumber >>> 24) & 255, (ipNumber >>> 16) & 255, (ipNumber >>> 8) & 255, ipNumber & 255].join(".");
      
      const broadcastAddress = [(ipNumber >>> 24) & 255, (ipNumber >>> 16) & 255, (ipNumber >>> 8) & 255, (ipNumber & 255) - 1].join(".");
      const startIp = assignedIP.split(".").map(Number);
      startIp[3] += 1;
      const endIp = broadcastAddress.split(".").map(Number);
      endIp[3] -= 1;

      return { 
        ...subnet, 
        name: `${index + 1}`,
        prefix: subnetPrefix, 
        size: subnetSize,
        ip: assignedIP,
        broadcast: broadcastAddress,
        startIp: startIp.join("."),
        endIp: endIp.join("."),
        mask: subnetMask(subnetPrefix)
      };
    });
    
    setSubnets(calculatedSubnets);
    setResult({ message: "Subredes calculadas con éxito." });
  };

  const subnetMask = (prefix) => {
    return Array(4).fill(0).map((_, i) => {
      if (prefix >= (i + 1) * 8) return 255;
      if (prefix <= i * 8) return 0;
      return 256 - Math.pow(2, 8 - (prefix % 8));
    }).join(".");
  };

  return (
    <div className="flex flex-col items-center max-w-lg gap-0 p-4 mx-auto">
      <h1 className="text-2xl font-bold">Calculadora de Subredes con VLSM</h1>
      <p className="text-gray-600">Esta herramienta te ayudará a calcular subredes usando VLSM y entender cómo funcionan.</p>
      <section className="flex flex-col items-center justify-center max-w-lg mt-4">
        <div className="my-4">
          <label className="block">Dirección IP / Prefijo:</label>
          <input type="text" value={ipWithPrefix} onChange={(e) => setIpWithPrefix(e.target.value)} className="w-full p-2 border" placeholder="Ej: 192.168.1.0/24" />
        </div>
        <div className="my-4">
          <label className="block">Cantidad de subredes:</label>
          <input type="number" value={subnetCount} onChange={handleSubnetCountChange} className="w-full p-2 border" placeholder="Ej: 3" />
        </div>
        {subnets.map((subnet, index) => (
          <div key={index} className="p-2 my-2 border rounded">
            <label className="block">{subnet.name} - Cantidad de Hosts:</label>
            <input type="number" value={subnet.hosts} onChange={(e) => handleSubnetChange(index, "hosts", e.target.value)} className="w-full p-2 border" placeholder="Ej: 50" />
          </div>
        ))}
        <button onClick={calculateSubnets} className="p-2 mt-4 text-white bg-gray-800 rounded">Calcular</button>
      </section>
      {result && (
        <div className="px-1 py-4 mt-4 rounded">
          <h4 className="">Resultados:</h4>
          <p>{result.message}</p>
          <div className="overflow-x-auto">
            <table className="w-full mt-2 text-xs text-center border border-collapse">
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
                    <td className="p-1 border">{subnet.hosts}</td>
                    <td className="p-1 border">{subnet.size - 2}</td>
                    <td className="hidden p-1 border md:table-cell">{subnet.size - 2 - subnet.hosts}</td>
                    <td className="p-1 border">{subnet.ip}/{subnet.prefix}</td>
                    <td className="p-1 border">{subnet.mask}</td>
                    <td className="p-1 border">{subnet.startIp} - {subnet.endIp}</td>
                    <td className="p-1 border">{subnet.broadcast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subnets.map(subnet => ({
                    ...subnet,
                    hosts: parseInt(subnet.hosts, 10) || 0
                  }))}
                  dataKey="hosts"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {subnets.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
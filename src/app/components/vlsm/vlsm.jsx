'use client';
import React from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("");
  const [subnetCount, setSubnetCount] = useState(0);
  const [subnets, setSubnets] = useState([]);
  const [result, setResult] = useState(null);

  const isValidIP = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleSubnetCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setSubnetCount(count);
    setSubnets(Array.from({ length: count }, (_, i) => ({ name: `Subred ${i + 1}`, hosts: "", prefix: 0 })));
  };

  const handleSubnetChange = (index, field, value) => {
    const updatedSubnets = [...subnets];
    updatedSubnets[index][field] = value;
    setSubnets(updatedSubnets);
  };

  const calculateSubnets = () => {
    if (!isValidIP(ip)) {
      setResult({ message: "Error: Dirección IP no válida." });
      return;
    }
    
    const sortedSubnets = [...subnets].sort((a, b) => parseInt(b.hosts, 10) - parseInt(a.hosts, 10));
    let currentIP = ip;
    const calculatedSubnets = sortedSubnets.map((subnet, index) => {
      const neededHosts = parseInt(subnet.hosts, 10) + 2;
      let prefix = 32;
      while (Math.pow(2, 32 - prefix) < neededHosts) {
        prefix--;
      }
      const assignedIP = currentIP;
      const subnetSize = Math.pow(2, 32 - prefix);
      
      const newSubnet = { 
        ...subnet, 
        prefix, 
        size: subnetSize
      };
      
      const ipParts = assignedIP.split(".").map(Number);
      let ipNumber = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
      ipNumber += subnetSize;
      currentIP = [(ipNumber >>> 24) & 255, (ipNumber >>> 16) & 255, (ipNumber >>> 8) & 255, ipNumber & 255].join(".");
      
      return newSubnet;
    });
    
    setSubnets(calculatedSubnets);
    setResult({ message: "Subredes calculadas con éxito." });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Calculadora de Subredes con VLSM</h1>
      <p className="text-gray-600">Esta herramienta te ayudará a calcular subredes usando VLSM y entender cómo funcionan.</p>
      <div className="my-4">
        <label className="block">Dirección IP:</label>
        <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} className="border p-2 w-full" placeholder="Ej: 192.168.1.0" />
      </div>
      <div className="my-4">
        <label className="block">Cantidad de subredes:</label>
        <input type="number" value={subnetCount} onChange={handleSubnetCountChange} className="border p-2 w-full" placeholder="Ej: 3" />
      </div>
      {subnets.map((subnet, index) => (
        <div key={index} className="my-2 p-2 border rounded">
          <label className="block">{subnet.name} - Cantidad de Hosts:</label>
          <input type="number" value={subnet.hosts} onChange={(e) => handleSubnetChange(index, "hosts", e.target.value)} className="border p-2 w-full" placeholder="Ej: 50" />
          {subnet.prefix && (
            <p className="text-sm text-gray-600">Prefijo: /{subnet.prefix} - Dirección: {subnet.ip}</p>
          )}
        </div>
      ))}
      <button onClick={calculateSubnets} className="bg-blue-500 text-white p-2 rounded mt-4">Calcular</button>
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Resultados:</h2>
          <p>{result.message}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subnets} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="size" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

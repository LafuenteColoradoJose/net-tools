"use client";
import React, { useState } from "react";

export default function HostCapacity() {
    const [ip, setIp] = useState("");
    const [prefix, setPrefix] = useState("");
    const [result, setResult] = useState({
        message: "Introduce una dirección IP y un prefijo para calcular el rango de IPs útiles."
    });

    const isValidIP = (ip) => {
        const regex =
            /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
        return regex.test(ip);
    };

    const calculateHosts = (e) => {
        e.preventDefault();
        if (!isValidIP(ip)) {
            setResult({ message: "Error: Dirección IP no válida." });
            return;
        }

        const ipParts = ip.split(".").map(Number);
        const prefixNum = parseInt(prefix, 10);
        const subnetSize = Math.pow(2, 32 - prefixNum);
        const hosts = subnetSize - 2;

        const startIp = [...ipParts];
        startIp[3] += 1;
        const endIp = [...ipParts];
        endIp[3] += hosts;

        const result = {
            ip: ip,
            prefix: prefixNum,
            subnetSize: subnetSize,
            hosts: hosts,
            startIp: startIp.join("."),
            endIp: endIp.join("."),
        };
        setResult(result);
    };

    return (
        <div className="">
            <div className="">
                <h1 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                    Rango de IPs útiles
                </h1>

                <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                    Dirección de RED más 1 y menos Dirección de Broadcast menos 1.
                </p>

                <form
                    action="#"
                    className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8"
                    onSubmit={calculateHosts}
                >
                    <p className="text-lg font-medium text-center">
                        Fórmula 2<sup>n</sup>-2.
                    </p>

                    <div className="flex items-center space-x-2">
                        <div className="flex-grow">
                            <label htmlFor="text" className="sr-only">
                                Dirección de RED
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-xs"
                                    placeholder="Dirección de RED"
                                    value={ip}
                                    onChange={(e) => setIp(e.target.value)}
                                />
                            </div>
                        </div>

                        <span>/</span>

                        <div className="w-20">
                            <label htmlFor="prefix" className="sr-only">
                                Prefijo de RED
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-xs"
                                    placeholder="Prefijo"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="block w-full px-5 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg"
                    >
                        Calcular
                    </button>
                </form>

                {result && (
                    <div className="mt-6 text-center">
                        {result.message ? (
                            <p className="text-red-500">{result.message}</p>
                        ) : (
                            <>
                                <p className="text-lg">
                                    Rango de IPs útiles: {result.startIp} - {result.endIp}
                                </p>
                                <p className="text-lg">Número de IPs útiles: {result.hosts.toLocaleString()}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

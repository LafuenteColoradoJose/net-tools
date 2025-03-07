'use client';
import React, { useState } from "react";

export default function NetworkAddress() {
    const [ip, setIp] = useState("");
    const [prefix, setPrefix] = useState("");
    const [result, setResult] = useState({
        message: "Introduce una dirección IP y un prefijo para calcular la dirección de red."
    });

    const isValidIP = (ip) => {
        const regex =
            /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
        return regex.test(ip);
    };

    const calculateNetworkAddress = (e) => {
        e.preventDefault();
        if (!isValidIP(ip)) {
            setResult({ message: "Error: Dirección IP no válida." });
            return;
        }

        const ipParts = ip.split(".").map(Number);
        const prefixNum = parseInt(prefix, 10);
        const subnetMask = Array(4).fill(0).map((_, i) => {
            if (prefixNum >= (i + 1) * 8) return 255;
            if (prefixNum <= i * 8) return 0;
            return 256 - Math.pow(2, 8 - (prefixNum % 8));
        });

        const networkAddress = ipParts.map((part, i) => part & subnetMask[i]).join(".");

        setResult({
            message: `La dirección de red es: ${networkAddress}`,
            networkAddress: networkAddress
        });
    };

    return (
        <div className="flex flex-col max-w-lg p-4 mx-auto">
            <div className="">
                <h1 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                    Dirección de Red
                </h1>

                <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                    Calcula la dirección de red dada una dirección IP y un prefijo.
                </p>

                <form
                    action="#"
                    className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8"
                    onSubmit={calculateNetworkAddress}
                >
                    <div className="flex items-center space-x-2">
                        <div className="flex-grow">
                            <label htmlFor="text" className="sr-only">
                                Dirección IP
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                    placeholder="Dirección IP"
                                    value={ip}
                                    onChange={(e) => setIp(e.target.value)}
                                />
                            </div>
                        </div>

                        <span>/</span>

                        <div className="w-20">
                            <label htmlFor="prefix" className="sr-only">
                                Prefijo
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
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
                        {result.message && (
                            <p className="text-lg">{result.message}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
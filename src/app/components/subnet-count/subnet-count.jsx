'use client';
import React, { useState } from "react";

export default function SubnetCount() {
    const [prefix, setPrefix] = useState("");
    const [subnetBits, setSubnetBits] = useState("");
    const [result, setResult] = useState({
        message: "Introduce un prefijo y el número de bits para calcular cuántas subredes se pueden crear."
    });

    const calculateSubnets = (e) => {
        e.preventDefault();
        const prefixNum = parseInt(prefix, 10);
        const subnetBitsNum = parseInt(subnetBits, 10);

        if (isNaN(prefixNum) || isNaN(subnetBitsNum) || prefixNum < 0 || prefixNum > 32 || subnetBitsNum < 0 || subnetBitsNum > 32 - prefixNum) {
            setResult({ message: "Error: Prefijo o número de bits no válidos." });
            return;
        }

        const subnets = Math.pow(2, subnetBitsNum);

        setResult({
            message: `Se pueden crear ${subnets} subredes con un prefijo de ${prefixNum} y ${subnetBitsNum} bits para subredes.`,
            subnets: subnets
        });
    };

    return (
        <div className="flex flex-col max-w-lg p-4 mx-auto">
            <div className="">
                <h1 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                    Subnet Count
                </h1>

                <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                    Calcula cuántas redes se pueden crear con un cierto número de bits, asumiendo que todas tienen el mismo número de dispositivos.
                </p>

                <form
                    action="#"
                    className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8"
                    onSubmit={calculateSubnets}
                >
                    <div className="flex items-center space-x-2">
                        <div className="flex-grow">
                            <label htmlFor="prefix" className="sr-only">
                                Prefijo
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

                        <span>+</span>

                        <div className="flex-grow">
                            <label htmlFor="subnetBits" className="sr-only">
                                Bits para Subred
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-xs"
                                    placeholder="Bits para Subred"
                                    value={subnetBits}
                                    onChange={(e) => setSubnetBits(e.target.value)}
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
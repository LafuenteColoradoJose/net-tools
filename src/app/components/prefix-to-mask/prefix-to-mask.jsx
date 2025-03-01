'use client';
import React, { useState } from 'react';

export default function PrefixToMask() {
    const [prefix, setPrefix] = useState("");
    const [result, setResult] = useState({
        message: "Introduce un prefijo para calcular la máscara de subred."
    });

    const calculateMask = (e) => {
        e.preventDefault();
        const prefixNum = parseInt(prefix, 10);
        if (prefixNum < 0 || prefixNum > 32) {
            setResult({ message: "Error: Prefijo inválido." });
            return;
        }

        const subnetMask = Array(4).fill(0).map((_, i) => {
            if (prefixNum >= (i + 1) * 8) return 255;
            if (prefixNum <= i * 8) return 0;
            return 256 - Math.pow(2, 8 - (prefixNum % 8));
        });

        setResult({
            message: `La máscara de subred es: ${subnetMask.join(".")}`,
            subnetMask: subnetMask.join(".")
        });
    };

    return (
        <div className="flex flex-col max-w-lg p-4 mx-auto">
            <div className="">
                <h1 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                    Máscara de Subred
                </h1>

                <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                    Calcula la máscara de subred dada un prefijo.
                </p>

                <form
                    action="#"
                    className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8"
                    onSubmit={calculateMask}
                >
                    <div className="flex items-center space-x-2">
                        <div className="flex-grow">
                            <label htmlFor="text" className="sr-only">
                                Prefijo
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    id="prefix"
                                    name="prefix"
                                    placeholder="Prefijo"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-20 p-4 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-xs"
                        >
                            Calcular
                        </button>
                    </div>  
                    <div className="mt-4 space-y-2">
                        <p className="text-lg font-medium text-center">
                            {result.message}
                        </p>
                        <p className="text-lg font-medium text-center">
                            {result.subnetMask}
                        </p>
                    </div>  
                </form>
            </div>  
        </div>  
        );
    }
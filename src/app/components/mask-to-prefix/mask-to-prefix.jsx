'use client';
import React, { useState } from 'react';

export default function MaskToPrefix() {
    const [mask, setMask] = useState('');
    const [prefix, setPrefix] = useState('');
    const [result, setResult] = useState({ message: 'Por favor, ingrese una máscara y haga clic en calcular.' });

    const calculatePrefix = () => {
        const maskParts = mask.split('.').map(Number);
        let binaryString = '';
        maskParts.forEach(part => {
            binaryString += part.toString(2).padStart(8, '0');
        });
        const prefixLength = binaryString.split('1').length - 1;
        setPrefix(prefixLength);
        setResult({ message: '', startIp: '192.168.0.1', endIp: '192.168.0.254', hosts: 254 });
    };

    return (
        <div>
            <form action="">
                <div className="flex flex-col max-w-lg p-4 mx-auto">
                    <h1 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                        Máscara a Prefijo
                    </h1>
                    <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
                        Convierte una máscara de subred en un prefijo
                    </p>
                    <div className="p-4 mt-6 mb-0 space-y-4 rounded-lg shadow-lg sm:p-6 lg:p-8">
                        <div className="flex items-center space-x-2">
                            <div className="flex-grow">
                                <label htmlFor="mask" className="sr-only">
                                    Máscara
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="mask"
                                        className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white"
                                        placeholder="Máscara"
                                        value={mask}
                                        onChange={(e) => setMask(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="w-full p-4 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-xs"
                            onClick={calculatePrefix}
                        >
                            Calcular Prefijo
                        </button>
                        <div className="mt-4 space-y-2">
                            <p className="text-lg font-medium text-center text-gray-700">
                                Prefijo: {prefix}
                            </p>
                            <p className="text-lg font-medium text-center text-gray-700">
                                {result.message}
                            </p>
                        </div> {/* Cierre de div */}
                    </div> {/* Cierre de div */}
                </div> {/* Cierre de div */}
            </form>
        </div>
    );
}
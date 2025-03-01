export default function Header() {
return (
    <header className="flex flex-col py-2 text-center text-white bg-gray-500 sm:flex-row">
        <table className="mx-auto mb-2 text-xs border border-collapse border-gray-700 table-auto">
            <thead>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Posición</th>
                    <th className="px-2 py-1 border border-gray-600">7</th>
                    <th className="px-2 py-1 border border-gray-600">6</th>
                    <th className="px-2 py-1 border border-gray-600">5</th>
                    <th className="px-2 py-1 border border-gray-600">4</th>
                    <th className="px-2 py-1 border border-gray-600">3</th>
                    <th className="px-2 py-1 border border-gray-600">2</th>
                    <th className="px-2 py-1 border border-gray-600">1</th>
                    <th className="px-2 py-1 border border-gray-600">0</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Valor</th>
                    <td className="px-2 py-1 border border-gray-600">128</td>
                    <td className="px-2 py-1 border border-gray-600">64</td>
                    <td className="px-2 py-1 border border-gray-600">32</td>
                    <td className="px-2 py-1 border border-gray-600">16</td>
                    <td className="px-2 py-1 border border-gray-600">8</td>
                    <td className="px-2 py-1 border border-gray-600">4</td>
                    <td className="px-2 py-1 border border-gray-600">2</td>
                    <td className="px-2 py-1 border border-gray-600">1</td>
                </tr>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">2<sup>n</sup></th>
                    <td className="px-2 py-1 border border-gray-600">2<sup>7</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>6</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>5</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>4</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>3</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>2</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>1</sup></td>
                    <td className="px-2 py-1 border border-gray-600">2<sup>0</sup></td>
                </tr>
            </tbody>
        </table>
        <table className="mx-auto text-xs border border-collapse border-gray-700 table-auto">
            <thead>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Octeto</th>
                    <th className="px-2 py-1 border border-gray-600">1</th>
                    <th className="px-2 py-1 border border-gray-600">2</th>
                    <th className="px-2 py-1 border border-gray-600">3</th>
                    <th className="px-2 py-1 border border-gray-600">4</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Bits</th>
                    <td className="px-2 py-1 border border-gray-600">11000000</td>
                    <td className="px-2 py-1 border border-gray-600">10100000</td>
                    <td className="px-2 py-1 border border-gray-600">00000001</td>
                    <td className="px-2 py-1 border border-gray-600">00000000</td>
                </tr>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Máscara</th>
                    <td className="px-2 py-1 border border-gray-600">11111111</td>
                    <td className="px-2 py-1 border border-gray-600">11111111</td>
                    <td className="px-2 py-1 border border-gray-600">11111111</td>
                    <td className="px-2 py-1 border border-gray-600">00000000</td>
                </tr>
                <tr>
                    <th className="px-2 py-1 border border-gray-600">Dirección IPv4</th>
                    <td className="px-2 py-1 border border-gray-600" colSpan="4">192.160.1.0 /24</td>
                </tr>
            </tbody>
        </table>
    </header>
);
}

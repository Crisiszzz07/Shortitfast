import { useState, useEffect } from 'react';
import { Copy, Info, Clock, Trash2, Sparkles, AlertTriangle } from 'lucide-react';

// ============================================================================
// FUNCIONES DE LOCALSTORAGE
// ============================================================================

interface LinkHistory {
    id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
}

const STORAGE_KEY = 'recent_links';

/**
 * Lee la historia de enlaces desde localStorage
 * @returns Array de objetos LinkHistory, o array vacío si no existen
 */
const getHistoryFromStorage = (): LinkHistory[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
};

/**
 * Guarda un nuevo enlace en la historia de localStorage
 * Agrega al inicio del array y limita a los 10 enlaces más recientes
 * @param originalUrl - La URL original larga
 * @param shortUrl - La URL corta generada
 */
const saveToHistory = (originalUrl: string, shortUrl: string): void => {
    try {
        const history = getHistoryFromStorage();

        // Verifica si esta URL ya existe en la historia
        const existingIndex = history.findIndex(item => item.originalUrl === originalUrl);

        if (existingIndex !== -1) {
            // Remueve la entrada existente
            history.splice(existingIndex, 1);
        }

        // Crea una nueva entrada
        const newEntry: LinkHistory = {
            id: Date.now().toString(),
            originalUrl,
            shortUrl,
            createdAt: new Date().toISOString()
        };

        // Agrega al inicio del array
        history.unshift(newEntry);

        // Limita a los 10 enlaces más recientes
        const trimmedHistory = history.slice(0, 10);

        // Guarda de vuelta en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

/**
 * Limpia toda la historia de localStorage
 */
const clearHistory = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

// ============================================================================
// COMPONENTE DE DE CONFIRMACION PORQUE EL DEFAULT ES FEO
// ============================================================================

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border-2 border-brand-purple/20 shadow-2xl animate-scaleIn">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-purple/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-brand-purple" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Clear History?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    This will permanently delete all your saved links from this browser. This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-gradient-purple text-white rounded-xl font-semibold hover:shadow-glow-purple transition-all duration-200"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ShortenerWidget() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isExisting, setIsExisting] = useState(false);
    const [history, setHistory] = useState<LinkHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Carga la historia al montar el componente
    useEffect(() => {
        const storedHistory = getHistoryFromStorage();
        setHistory(storedHistory);
        setShowHistory(storedHistory.length > 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Assuming there might be an error state, adding it here for consistency
        // setError(''); 
        setShortUrl('');
        setIsExisting(false);

        try {
            // Use production URL or fallback to localhost for development
            const API_URL = import.meta.env.PUBLIC_API_URL || 'https://shortitfast.onrender.com';

            const response = await fetch(`${API_URL}/shortitfast/postUrl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortUrl(data.shortUrl);

                // Verifica si la URL ya existía
                const isExistingUrl = data.message === "URL already shortified!";
                setIsExisting(isExistingUrl);

                // Guarda en localStorage
                saveToHistory(data.longUrl, data.shortUrl);

                // Actualiza el estado para reflejar la nueva historia
                setHistory(getHistoryFromStorage());
                setShowHistory(true);
            } else {
                console.error('Error shortening URL:', data);
                alert('Error shortening URL. Please try again.');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            alert('Network error. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setUrl('');
        setShortUrl('');
        setIsExisting(false);
    };

    const handleClearHistory = () => {
        setShowConfirmModal(true);
    };

    const confirmClearHistory = () => {
        clearHistory();
        setHistory([]);
        setShowHistory(false);
        setShowConfirmModal(false);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onConfirm={confirmClearHistory}
                onCancel={() => setShowConfirmModal(false)}
            />

            {/* Main Shortener Widget */}
            <div className="relative bg-white/30 backdrop-blur-xl rounded-4xl p-10 md:p-12 border border-white/40 shadow-float">
                {!shortUrl ? (
                    // Input State
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="url-input" className="sr-only">
                                Enter your long URL
                            </label>
                            <input
                                id="url-input"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste your long URL here..."
                                required
                                className="w-full px-6 py-5 text-lg rounded-3xl border-2 border-gray-200 focus:border-brand-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/20 transition-all placeholder:text-gray-400"
                                style={{ minHeight: '64px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto px-10 py-5 bg-gradient-purple text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-glow-purple hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ minHeight: '64px', minWidth: '180px' }}
                        >
                            {isLoading ? 'Shortening...' : 'Shorten'}
                        </button>

                        {/* Render Free Tier Info Message */}
                        {isLoading && (
                            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-semibold mb-1">Please wait...</p>
                                        <p className="text-blue-600">
                                            This is a demo using Render's free tier. If the server was idle,
                                            it may take 30-60 seconds to wake up. Thank you for your patience!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                ) : (
                    // Success State
                    <div className="space-y-6">
                        {/* Mensaje de información si la URL ya existía */}
                        {isExisting && (
                            <div className="bg-brand-purple/10 border-2 border-brand-purple rounded-2xl p-4 flex items-start gap-3">
                                <Info className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-brand-purple mb-1">
                                        URL Already Shortened
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        This URL was previously shortened. We're showing you the existing short link instead of creating a duplicate.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border-4 border-brand-lime rounded-2xl p-6">
                            <p className="text-sm text-gray-600 mb-3 font-medium">Your shortened URL:</p>
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    readOnly
                                    value={shortUrl}
                                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-brand-purple font-semibold text-lg"
                                />
                                <button
                                    onClick={() => handleCopy(shortUrl)}
                                    className="px-6 py-3 bg-gradient-purple text-white rounded-xl font-semibold hover:shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-5 h-5" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="text-brand-purple font-semibold hover:text-brand-purple-dark transition-colors"
                        >
                            ← Shorten another URL
                        </button>
                    </div>
                )}
            </div>

            {/* Historial de enlaces */}
            {showHistory && history.length > 0 && (
                <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-lg">
                    {/* Encabezado con Botón de Borrar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-purple" />
                            <h3 className="text-lg font-semibold text-gray-800">Recent Links</h3>
                        </div>
                        <button
                            onClick={handleClearHistory}
                            className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-brand-purple/5 to-brand-lime/5 border border-brand-purple/20 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                                <strong className="text-brand-purple">Portfolio Feature:</strong> Your link history is saved locally in this browser for testing purposes only.
                                This is not permanent storage—clearing your cache or switching devices will erase this history.
                            </p>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/60 rounded-xl p-4 border border-gray-200 hover:border-brand-purple transition-all"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {formatDate(item.createdAt)}
                                            </p>
                                            <p className="text-sm text-gray-700 truncate" title={item.originalUrl}>
                                                {item.originalUrl}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={item.shortUrl}
                                            className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 text-brand-purple font-medium"
                                        />
                                        <button
                                            onClick={() => handleCopy(item.shortUrl)}
                                            className="px-3 py-2 bg-brand-purple/10 text-brand-purple rounded-lg hover:bg-brand-purple/20 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { Save, Clock, Users, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface WriteupEditorProps {
    challengeId: number;
    initialContent: string;
    initialUpdatedAt?: string;
}

export function WriteupEditor({ challengeId, initialContent, initialUpdatedAt }: WriteupEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialUpdatedAt ?? null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const lastSavedContent = useRef(initialContent);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Format timestamp for display
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Save function
    const saveWriteup = useCallback(async () => {
        if (content === lastSavedContent.current) {
            setHasUnsavedChanges(false);
            return;
        }

        setIsSaving(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/ctf/writeup/${challengeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                setLastSavedAt(data.updatedAt);
                lastSavedContent.current = content;
                setHasUnsavedChanges(false);
            }
        } catch (error) {
            console.error('Failed to save writeup:', error);
        } finally {
            setIsSaving(false);
        }
    }, [content, challengeId]);

    // Auto-save every 5 seconds when there are changes
    useEffect(() => {
        if (hasUnsavedChanges) {
            saveTimeoutRef.current = setTimeout(() => {
                saveWriteup();
            }, 3000);
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [hasUnsavedChanges, saveWriteup]);

    // Debounced content change handler
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        
        if (newContent !== lastSavedContent.current) {
            setHasUnsavedChanges(true);
        }
        
        // Clear existing timeout and set new one (debounce)
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };

    // Save on tab close/navigate away
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (hasUnsavedChanges) {
                saveWriteup();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, saveWriteup]);

    // Ctrl+S keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveWriteup();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [saveWriteup]);

    return (
        <div className="space-y-4">
            {/* Status Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Writeup ini dibagikan ke seluruh tim</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Save className="h-4 w-4" />
                    <span>Auto-save aktif</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-primary">Menyimpan...</span>
                        </>
                    ) : lastSavedAt ? (
                        <>
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">
                                Terakhir disimpan: {formatTime(lastSavedAt)}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Belum disimpan</span>
                    )}
                </div>
                
                {hasUnsavedChanges && !isSaving && (
                    <span className="text-yellow-500">• Perubahan belum disimpan</span>
                )}
            </div>

            {/* Editor */}
            <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Tulis writeup kamu di sini...

Contoh format:
## Analisis
[Jelaskan analisis challenge]

## Solusi
[Langkah-langkah solusi]

## Flag
[Flag yang ditemukan]"
                className="min-h-[400px] resize-y font-mono text-sm"
            />
            
            <p className="text-xs text-muted-foreground">
                Tip: Tekan Ctrl+S untuk menyimpan manual, atau writeup akan otomatis tersimpan setiap 3 detik.
            </p>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => saveWriteup()}
                    disabled={isSaving || !hasUnsavedChanges}
                    variant={hasUnsavedChanges ? 'default' : 'outline'}
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save
                </Button>
            </div>
        </div>
    );
}

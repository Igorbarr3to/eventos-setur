'use client';

import { useEffect, useState } from "react";
import { FormularioTemplate } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AplicarTemplateModalProps {
  pesquisaId: number;
  onFormularioCriado: () => void;
}

export function AplicarTemplateModal({ pesquisaId, onFormularioCriado }: AplicarTemplateModalProps) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<FormularioTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // Busca a lista de templates disponíveis quando o modal abre
      const fetchTemplates = async () => {
        const response = await fetch('/api/admin/templates');
        const data = await response.json();
        setTemplates(data);
      };
      fetchTemplates();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedTemplateId) {
      toast.error("Por favor, selecione um template.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/pesquisas/${pesquisaId}/aplicar-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: parseInt(selectedTemplateId) }),
      });

      if (!response.ok) throw new Error("Falha ao aplicar o template.");

      toast.success("Formulário criado a partir do template com sucesso!");
      setOpen(false);
      onFormularioCriado();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Usar Template</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Aplicar um Template de Formulário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label htmlFor="template-select">Selecione um template</Label>
          <Select onValueChange={setSelectedTemplateId}>
            <SelectTrigger id="template-select">
              <SelectValue placeholder="Escolha um modelo..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={String(template.id)}>
                  {template.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Aplicando..." : "Aplicar Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
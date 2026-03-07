import { useState, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RequestAttachmentDTO, RequestDTO, RequestMessageDTO, createRequestMessage, fetchRequestById, listRequestAttachments, listRequestMessages, uploadRequestAttachment } from '@/lib/api';
import { serviceDefinitions, type ServiceDefinition } from '@/features/requests/data/services';

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const RequestInfo = ({ request }: { request?: RequestDTO }) => (
  <SectionCard title="Détails de la demande">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
        <div className="text-sm font-medium">{request?.type || 'N/A'}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Statut</div>
        <div className="text-sm font-medium">
          {request?.status ? (
            <Badge variant="outline" className="capitalize">
              {request.status.toLowerCase()}
            </Badge>
          ) : 'N/A'}
        </div>
      </div>
    </div>
  </SectionCard>
);

const RequestTracking = ({ id, messages }: { id: number; messages?: RequestMessageDTO[] }) => {
  const [message, setMessage] = useState('');
  const sendMut = useMutation({
    mutationFn: (content: string) => createRequestMessage(id, content),
    onSuccess: () => setMessage(''),
  });

  return (
    <SectionCard title="Suivi">
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          <ScrollArea className="h-64 pr-3">
            <ul className="space-y-3">
              {(messages ?? []).map((m) => (
                <li key={m.id} className="rounded-md border p-3 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {(m.author || 'U')
                          .split(' ')
                          .map((s) => s[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{m.author || 'Utilisateur'}</div>
                  </div>
                  <div className="mt-1 text-sm">{m.content}</div>
                </li>
              ))}
              {(!messages || messages.length === 0) && (
                <li className="text-sm text-gray-500 dark:text-gray-400">Aucun événement pour le moment.</li>
              )}
            </ul>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <ScrollArea className="h-64 pr-3 mb-4">
            <ul className="space-y-3">
              {(messages ?? []).map((m) => (
                <li key={m.id} className="rounded-md border p-3 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {(m.author || 'U')
                          .split(' ')
                          .map((s) => s[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{m.author || 'Utilisateur'}</div>
                  </div>
                  <div className="mt-1 text-sm">{m.content}</div>
                </li>
              ))}
              {(!messages || messages.length === 0) && (
                <li className="text-sm text-gray-500 dark:text-gray-400">Aucun message pour le moment.</li>
              )}
            </ul>
          </ScrollArea>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <Textarea
              rows={3}
              placeholder="Écrire un message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
            <Button
              className="md:self-start hover:bg-primary/90 transition-colors"
              disabled={!message || sendMut.isPending}
              onClick={() => sendMut.mutate(message)}
            >
              Envoyer
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </SectionCard>
  );
};

// Component for Attachments
const RequestAttachments = ({ id, attachments, refetchAttachments }: { id: number; attachments?: RequestAttachmentDTO[]; refetchAttachments: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const uploadMut = useMutation({
    mutationFn: (f: File) => uploadRequestAttachment(id, f),
    onSuccess: () => {
      setFile(null);
      refetchAttachments();
    },
  });

  const isImage = (name: string) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(name);
  const isPdf = (name: string) => /\.pdf$/i.test(name);
  const getExt = (name: string) => {
    const idx = name.lastIndexOf('.')
    return idx > -1 ? name.slice(idx + 1).toLowerCase() : ''
  }

  return (
    <SectionCard title="Pièces jointes">
      <ul className="space-y-3 mb-4">
        {(attachments ?? []).map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 rounded-md border p-3 bg-white dark:bg-gray-800">
            <span className="truncate text-sm flex items-center gap-2">
              {a.filename}
              {a.filename ? (
                <Badge variant="outline" className="uppercase text-[10px] px-1 py-0">
                  {getExt(a.filename) || 'file'}
                </Badge>
              ) : null}
            </span>
            <div className="flex items-center gap-2">
              {a.url ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewUrl(a.url || '');
                      setPreviewName(a.filename || 'Document');
                      setPreviewOpen(true);
                    }}
                  >
                    Aperçu
                  </Button>
                  <a
                    className="text-primary underline text-sm hover:text-primary/80"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    Télécharger
                  </a>
                </>
              ) : (
                <span className="text-xs text-gray-500">URL indisponible</span>
              )}
            </div>
          </li>
        ))}
        {(!attachments || attachments.length === 0) && (
          <li className="text-sm text-gray-500 dark:text-gray-400">Aucune pièce jointe.</li>
        )}
      </ul>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <Button
          disabled={!file || uploadMut.isPending}
          onClick={() => file && uploadMut.mutate(file)}
          className="hover:bg-primary/90 transition-colors"
        >
          Téléverser
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="truncate">{previewName}</DialogTitle>
          </DialogHeader>
          {previewUrl ? (
            isImage(previewUrl || previewName) ? (
              <div className="flex items-center justify-center">
                <img src={previewUrl} alt={previewName} className="max-h-[80vh] w-auto object-contain" />
              </div>
            ) : isPdf(previewUrl || previewName) ? (
              <iframe
                src={`${previewUrl}#view=FitH`}
                className="w-[80vw] h-[80vh] border rounded"
                title={previewName}
              />
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Aperçu non pris en charge. Veuillez utiliser le lien Télécharger.
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
};

// Appointments temporarily removed

// Component for Service Overview
const ServiceOverview = ({ service }: { service?: ServiceDefinition }) => (
  <SectionCard title="Service">
    {service ? (
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="text-gray-500 dark:text-gray-400">Nom</div>
          <div className="font-medium">{service.label}</div>
          <div className="text-gray-500 dark:text-gray-400">Pays</div>
          <div className="font-medium">{service.country}</div>
        </div>
        {service.description ? (
          <>
            <Separator />
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">Description</div>
              <div className="rounded-md border bg-gray-100 dark:bg-gray-800 p-3 leading-relaxed">
                {service.description}
              </div>
            </div>
          </>
        ) : null}
      </div>
    ) : (
      <div className="text-sm text-gray-500 dark:text-gray-400">Service introuvable.</div>
    )}
  </SectionCard>
);

// Component for Service Documents
const ServiceDocuments = ({ service }: { service?: ServiceDefinition }) => (
  <SectionCard title="Documents requis">
    {service?.documents && service.documents.length > 0 ? (
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {service.documents.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    ) : (
      <div className="text-sm text-gray-500 dark:text-gray-400">Aucun document requis.</div>
    )}
  </SectionCard>
);

function parseDynamicFieldsFromDescription(desc?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!desc) return result;
  const firstPipe = desc.indexOf(" | ");
  if (firstPipe === -1) return result;
  const tail = desc.slice(firstPipe + 3);
  const parts = tail.split(" | ");
  for (const p of parts) {
    const idx = p.indexOf(":");
    if (idx === -1) continue;
    const key = p.slice(0, idx).trim();
    const val = p.slice(idx + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDocumentNamesFromDescription(desc?: string, service?: ServiceDefinition): string[] {
  if (!desc || !service?.documents?.length) return [];
  const found: string[] = [];
  for (const doc of service.documents) {
    const re = new RegExp(`${escapeRegExp(doc)}\s*:\\s*([^|]+)`, 'i');
    const m = desc.match(re);
    if (m && m[1]) {
      found.push(`${doc}: ${m[1].trim()}`);
    }
  }
  return found;
}

const SubmittedDocuments = ({ submitted }: { submitted: string[] }) => (
  <SectionCard title="Documents soumis">
    {submitted.length > 0 ? (
      <ul className="space-y-2 text-sm">
        {submitted.map((d) => {
          const idx = d.indexOf(':')
          const label = idx > -1 ? d.slice(0, idx).trim() : d
          const filename = idx > -1 ? d.slice(idx + 1).trim() : ''
          const extIdx = filename.lastIndexOf('.')
          const ext = extIdx > -1 ? filename.slice(extIdx + 1).toLowerCase() : ''
          return (
            <li key={d} className="flex items-center justify-between rounded-md border p-2">
              <span className="truncate">
                <span className="text-gray-500 dark:text-gray-400">{label}:</span> {filename || '—'}
              </span>
              {filename ? (
                <Badge variant="outline" className="uppercase text-[10px] px-1 py-0">{ext || 'file'}</Badge>
              ) : null}
            </li>
          )
        })}
      </ul>
    ) : (
      <div className="text-sm text-gray-500 dark:text-gray-400">Aucun document soumis.</div>
    )}
  </SectionCard>
);

// Component to show service-specific fields and their submitted values
const ServiceFields = ({ service, dynamic }: { service?: ServiceDefinition; dynamic: Record<string, string> }) => (
  <SectionCard title="Champs du service">
    {service?.fields && service.fields.length > 0 ? (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {service.fields.map((f) => (
          <div key={f.name} className="space-y-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">{f.label}</div>
            <div className="text-sm font-medium break-words">
              {dynamic[f.name] && String(dynamic[f.name]).length > 0 ? dynamic[f.name] : <span className="text-gray-400">Non renseigné</span>}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-sm text-gray-500 dark:text-gray-400">Aucun champ défini pour ce service.</div>
    )}
  </SectionCard>
);

function parseSubmittedDocMap(desc?: string, service?: ServiceDefinition): Record<string, string> {
  const map: Record<string, string> = {};
  if (!desc || !service?.documents?.length) return map;
  for (const doc of service.documents) {
    const re = new RegExp(`${escapeRegExp(doc)}\\s*:\\s*([^|]+)`, 'i');
    const m = desc.match(re);
    if (m && m[1]) map[doc] = m[1].trim();
  }
  return map;
}

const RequiredDocumentsPreview = ({ service, attachments, submitted }:
  { service?: ServiceDefinition; attachments?: RequestAttachmentDTO[]; submitted: Record<string, string> }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const isImage = (name: string) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(name);
  const isPdf = (name: string) => /\.pdf$/i.test(name);
  const getExt = (name: string) => {
    const idx = name.lastIndexOf('.')
    return idx > -1 ? name.slice(idx + 1).toLowerCase() : ''
  }

  return (
    <SectionCard title="Documents">
      {service?.documents && service.documents.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {service.documents.map((label) => {
            const submittedName = submitted[label] || '';
            const match = (attachments || []).find(a => a.filename && submittedName && a.filename.toLowerCase() === submittedName.toLowerCase());
            return (
              <li key={label} className="flex items-center justify-between gap-3 rounded-md border p-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{label}</div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {submittedName || 'Ce document est requis.'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {submittedName ? (
                    <>
                      <span className="hidden md:inline-flex">
                        <Badge variant="outline" className="uppercase text-[10px] px-1 py-0">{getExt(submittedName) || 'file'}</Badge>
                      </span>
                      {match?.url ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewUrl(match.url || '');
                              setPreviewName(submittedName);
                              setPreviewOpen(true);
                            }}
                          >
                            Aperçu
                          </Button>
                          <a
                            className="text-primary underline hover:text-primary/80"
                            href={match.url}
                            target="_blank"
                            rel="noreferrer"
                            download
                          >
                            Télécharger
                          </a>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">Aperçu indisponible</span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-red-600">Requis</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">Aucun document requis.</div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="truncate">{previewName}</DialogTitle>
          </DialogHeader>
          {previewUrl ? (
            isImage(previewUrl || previewName) ? (
              <div className="flex items-center justify-center">
                <img src={previewUrl} alt={previewName} className="max-h-[80vh] w-auto object-contain" />
              </div>
            ) : isPdf(previewUrl || previewName) ? (
              <iframe
                src={`${previewUrl}#view=FitH`}
                className="w-[80vw] h-[80vh] border rounded"
                title={previewName}
              />
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Aperçu non pris en charge. Veuillez utiliser le lien Télécharger.
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}

export default function RequestDetails() {
  const { requestId } = useParams({ from: '/_authenticated/requests/$requestId' }) as { requestId: string };
  const id = useMemo(() => Number(requestId), [requestId]);

  const { data: request } = useQuery<RequestDTO>({
    queryKey: ['request', id],
    queryFn: () => fetchRequestById(id),
    enabled: !Number.isNaN(id),
  });

  const { data: messages } = useQuery<RequestMessageDTO[]>({
    queryKey: ['request', id, 'messages'],
    queryFn: () => listRequestMessages(id),
    enabled: !Number.isNaN(id),
  });

  const { data: attachments, refetch: refetchAttachments } = useQuery<RequestAttachmentDTO[]>({
    queryKey: ['request', id, 'attachments'],
    queryFn: () => listRequestAttachments(id),
    enabled: !Number.isNaN(id),
  });


  const service = useMemo<ServiceDefinition | undefined>(
    () => (request?.type ? serviceDefinitions.find((s) => s.value === request.type) : undefined),
    [request?.type]
  );
  const dynamicFields = useMemo(() => parseDynamicFieldsFromDescription(request?.description), [request?.description]);
  const submittedDocs = useMemo(() => parseDocumentNamesFromDescription(request?.description, service), [request?.description, service]);

  return (
    <>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Demande #{id}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Suivez, discutez et complétez votre demande.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Imprimer
            </Button>
            <Button size="sm" className="hover:bg-primary/90 transition-colors">
              Exporter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ServiceOverview service={service} />
            <ServiceFields service={service} dynamic={dynamicFields} />
            <RequestInfo request={request} />
            <RequestTracking id={id} messages={messages} />
          </div>
          <div className="space-y-6">
            <ServiceDocuments service={service} />
            <SubmittedDocuments submitted={submittedDocs} />
            <RequestAttachments id={id} attachments={attachments} refetchAttachments={refetchAttachments} />
            {/* Appointments removed for now */}
          </div>
        </div>
      </Main>
    </>
  );
}
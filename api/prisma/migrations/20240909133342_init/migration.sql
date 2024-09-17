-- CreateTable
CREATE TABLE "vouches" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "participanteId" INTEGER,
    "convidadoId" INTEGER,

    CONSTRAINT "vouches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vouchId" INTEGER,

    CONSTRAINT "participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convidados" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "vouchId" INTEGER,

    CONSTRAINT "convidados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vouches_codigo_key" ON "vouches"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vouches_participanteId_key" ON "vouches"("participanteId");

-- CreateIndex
CREATE UNIQUE INDEX "vouches_convidadoId_key" ON "vouches"("convidadoId");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_cpf_key" ON "participantes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_vouchId_key" ON "participantes"("vouchId");

-- CreateIndex
CREATE UNIQUE INDEX "convidados_email_key" ON "convidados"("email");

-- CreateIndex
CREATE UNIQUE INDEX "convidados_cpf_key" ON "convidados"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "convidados_vouchId_key" ON "convidados"("vouchId");

-- AddForeignKey
ALTER TABLE "vouches" ADD CONSTRAINT "vouches_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouches" ADD CONSTRAINT "vouches_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES "convidados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

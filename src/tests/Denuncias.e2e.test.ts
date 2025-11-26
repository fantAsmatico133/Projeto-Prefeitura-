import request from "supertest";
import { app } from "../server"; // Importa seu App Express
import { connection } from "../dbConnection";

describe("Denúncias E2E - Da Criação à Denúncia", () => {
    
    // Variáveis para guardar dados entre os passos
    let tokenAdmin: string;
    let tokenCidadao: string;
    let idDepartamento: number;
    let idTipoDenuncia: number;

    // 1. SETUP: Limpar o banco antes de começar
    beforeAll(async () => {
        // Apaga dados na ordem correta (filhos primeiro) para evitar erro de chave estrangeira
        await connection("comentarios").del();
        await connection("confirmacoes").del();
        await connection("denuncias").del();
        await connection("tipo_denuncia").del();
        await connection("departamentos").del();
        await connection("usuarios").del();
    });

    // 2. TEARDOWN: Fechar conexão após terminar
    afterAll(async () => {
        await connection.destroy();
    });

    // --- CENÁRIO 1: Preparando os Usuários ---
    
    test("1. Deve criar um Administrador (Funcionário) e fazer Login", async () => {
        // A. Criar Usuário Admin
        const resSignup = await request(app).post("/usuarios").send({
            nome: "Admin Teste",
            email: "admin@teste.com",
            senha: "123" 
            // Nota: No seu controller atual, todo mundo nasce 'cidadao'.
            // Precisamos atualizar manualmente no banco para 'funcionario' para o teste funcionar.
        });
        expect(resSignup.status).toBe(201);
        const adminId = resSignup.body.id; // Ou recuperar do banco se o endpoint não retornar ID

        // Hack para E2E: Forçar admin virar 'funcionario' no banco
        await connection("usuarios").where({ email: "admin@teste.com" }).update({ papel: "funcionario" });

        // B. Fazer Login
        const resLogin = await request(app).post("/usuarios/login").send({
            email: "admin@teste.com",
            senha: "123"
        });
        
        expect(resLogin.status).toBe(200);
        tokenAdmin = resLogin.text; // Seu endpoint retorna o token direto como string
        expect(tokenAdmin).toBeDefined();
    });

    test("2. Deve criar um Cidadão Comum e fazer Login", async () => {
        // A. Criar Cidadão
        await request(app).post("/usuarios").send({
            nome: "Cidadão Teste",
            email: "cidadao@teste.com",
            senha: "123"
        });

        // B. Login Cidadão
        const res = await request(app).post("/usuarios/login").send({
            email: "cidadao@teste.com",
            senha: "123"
        });

        expect(res.status).toBe(200);
        tokenCidadao = res.text;
    });

    // --- CENÁRIO 2: Admin cria a estrutura ---

    test("3. Admin deve criar um Departamento", async () => {
        // Precisamos do ID do próprio admin para ser o gerente
        const admin = await connection("usuarios").where({ email: "admin@teste.com" }).first();

        const res = await request(app)
            .post("/departamentos")
            .set("Authorization", `Bearer ${tokenAdmin}`) // Header de Autenticação
            .send({
                nome: "Departamento de Obras",
                endereco: "Rua das Obras, 100",
                horario_funcionamento: "08h-18h",
                gerente_id: admin.id
            });

        expect(res.status).toBe(201);
        idDepartamento = res.body.id;
    });

    test("4. Admin deve criar um Tipo de Denúncia vinculado ao Departamento", async () => {
        const res = await request(app)
            .post("/tipo-denuncia")
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({
                nome: "Buraco na via",
                departamento_id: idDepartamento
            });

        expect(res.status).toBe(201);
        // O retorno do seu controller é { ID: numero }
        idTipoDenuncia = res.body.ID;
    });

    // --- CENÁRIO 3: Cidadão usa o sistema ---

    test("5. Cidadão deve criar uma Denúncia com sucesso", async () => {
        const res = await request(app)
            .post("/denuncias")
            .set("Authorization", `Bearer ${tokenCidadao}`)
            .send({
                titulo: "Buraco enorme na minha rua",
                descricao: "Está atrapalhando o trânsito",
                endereco_denuncia: "Av. Principal, 500",
                tipo_denuncia_id: idTipoDenuncia,
                anonimo: false
            });

        expect(res.status).toBe(201);
        expect(res.body.prioridade).toBeDefined();
        
        // Verificação final no banco de dados para garantir persistência
        const denunciaNoBanco = await connection("denuncias").where({ id: res.body.id }).first();
        expect(denunciaNoBanco).toBeTruthy();
        expect(denunciaNoBanco.titulo).toBe("Buraco enorme na minha rua");
    });

    test("6. Admin consulta estatísticas e vê a nova denúncia", async () => {
        const res = await request(app)
            .get("/denuncias/estatisticas")
            .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(res.status).toBe(200);
        expect(res.body.total_denuncias).toBeGreaterThanOrEqual(1);
    });
});
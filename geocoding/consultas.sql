/*
v01 => tipo da pesquisa
v02 => data da pesquisa ddmmaaaa => aaaammdd
v03 => hora da pesquisa
v04 => pesquisador
v05 => local da pesquisa
v06 => cidade onde começou o deslocamento
v07 => bairro onde começou o deslocamento
v08 => endereço onde começou o deslocamento
v09 => ponto de referência de onde começou o deslocamento
v10 => tipo de lugar de onde começou o deslocamento
v11 => cidade onde encerrou o deslocamento
v12 => bairro onde encerrou o deslocamento
v13 => endereço onde encerrou o deslocamento
v14 => ponto de referência de onde encerrou o deslocamento
v15 => tipo de lugar de onde encerrou o deslocamento
v16 => motivo do deslocamento
v17 => quantidade de pessoas no veículo
v18 => tipo de veículo
v19 => frequência que utiliza a rota
v20 => tempo que a pessoa gasta pra fazer a rota
v21 => renda
v22 => sexo
v23 => idade
v24 => descricao
*/

-- MOBILIDADE URBANA FORMULÁRIO VEÍCULOS MOTORIZADOS
CREATE TABLE muf_vm (
	v01 NCHAR(200),
	v02 DATE,
	v03 INT,
	v04 NCHAR(200),
	v05 NCHAR(200),
	v06 NCHAR(200),
	v07 NCHAR(200),
	v08 NCHAR(200),
	v09 NCHAR(200),
	v10 NCHAR(200),
	v11 NCHAR(200),
	v12 NCHAR(200),
	v13 NCHAR(200),
	v14 NCHAR(200),
	v15 NCHAR(200),
	v16 NCHAR(200),
	v17 NCHAR(200),
	v18 NCHAR(200),
	v19 NCHAR(200),
	v20 NCHAR(200),
	v21 NCHAR(200),
	v22 NCHAR(200),
	v23 NCHAR(200),
	v24 NCHAR(200)
);
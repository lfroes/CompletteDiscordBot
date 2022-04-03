
  

  

# Complette Discord Bot

  

  

O Bot da complette foi feito para ajudar os funcionarios da Complette, com informações e a pegar e coletar dados da equipe, como tarefas, clientes e etc.

  

  

## Lista de comandos

  

  

| Comando |Oque faz | Sub Comandos? | Parametros?| Requer Cargos?
|--|--|--|--|
| [rank](#) | Traz o rank de melhores do mês | **Não** | **Não** | **Não**
| [profile](#) | Retorna o perfil do colaborador | **Sim** | **Não** | **Não**

  

  

  

## Comandos

  

  

### Rank

  

Com o comando rank, você tem em retorno os melhores do mês, o rank é conectado com nosso banco de dados Mongo, com isso futuramente iremos implementar o historico de ranks.

  

### Profile

  

Com o comando profile, é possivel pegar os dados do colaborador ou parceiro / cliente da complette.
Se o usuario já existir no banco, ele não vai finalizar a criação

Se o usuario já existir no banco, ele não vai finalizar a criação

  

#### Sub Comandos

  

| Nome |Oque faz | Parametros?| Requer Cargos?
|--|--|--|--|
| [get](###rank) | Pegar informações de algum colaborador / parceiro | **Sim** | **Não** |
| [create](###profile) | Cria um perfil do colaborador / parceiro no CDD | **Não** | **Sim** |

  

| Parametro| Oque é | Obrigatorio? | Requer Cargos?
|--|--|--|--|
| [nome_do_colaborador](#) |nome do usuario que deseja encontrar   | **Não** | **Não** |

Retorna infomações do colaborador / parceiro

  

Quando com parametros retorna multiplos resultados (se tiver) enquanto sem retorna um valor unico procurando o perfil CDD do usuario que deu o comando no Discord.

  
  

##### Parametros

  

| Parametro| Oque é | Obrigatorio? | Requer Cargos?
|--|--|--|--|
| [nome_do_colaborador](###rank) |nome do usuario que deseja encontrar | **Não** | **Não** |

  
  
  
  
  
  
  
  

  

  

## Updates

  

  

Cheque o [changelog](https://github.com/lfroes/CompletteDiscordBot/blob/master/changelog.md) para mais informações.

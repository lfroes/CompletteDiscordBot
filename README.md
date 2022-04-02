
  

# Complette Discord Bot

  

O Bot da complette foi feito para ajudar os funcionarios da Complette, com informações e a pegar e coletar dados da equipe, como tarefas, clientes e etc.

  

## Lista de comandos

  
  

| Comando |Oque faz | Parametros? | Requer cargo?|
|--|--|--|--|
| [rank](###rank) | Traz o rank de melhores do mês | **Não** | **Não** |
| [profile](###profile) | Retorna o perfil do colaborador | **Sim** | **Não** |

  
  

  

## Commands

  

### Rank

Com o comando rank, você tem em retorno os melhores do mês, o rank é conectado com nosso banco de dados Mongo, com isso futuramente iremos implementar o historico de ranks.

### Profile

Com o comando profile, é possivel pegar os dados do colaborador ou parceiro / cliente da complette.

#### Parametros

| Parametro |Oque faz | Parametros? | Requer cargo?|
|--|--|--|--|
| [nome_do_colaborador](#) | O Nome da pessoa que você quer pegar o perfil | **Não** | **Não** |

#### Sub Comandos

| Sub Comando |Oque faz | Parametros? | Requer cargo?|
|--|--|--|--|
| [create](#) | Cria um novo profile no CDD (Via privado no discord)| **Não** | **Sim** |


  
  

  

## Updates

  

Cheque o [changelog](https://github.com/lfroes/CompletteDiscordBot/blob/master/changelog.md) para mais informações.
# Changelog


## [0.0.5] 03-04-2022

### Added 
- /profile delete command (Deletes user on CDD)
## [0.0.4a] 03-04-2022

### Bugfixes 
- INTERACTION_ALREADY_REPLIED on /profile create exit
It was happening because the reply on the start of the command works a return, and when the user finishes the creation of the profile a return have already happenend


## [0.0.4] 02-04-2022
### Added
- /profile get ( fetch user info on CDD )
- /profile create (create a new profile user on CDD) {Adm Only}


### Adjusments
- Mongo now is on .env file for security matters
- /profile get by itself try to catch user by discord user that called the command
## [0.0.3] 02-04-2022

### Adjusments
- Command /rank fully operational
## [0.0.2] 01-04-2022
### Added
- Eslint config
- /rank commmand (unfinished)

## [0.0.1] 01-04-2022

### Added
- Changelog Added :P
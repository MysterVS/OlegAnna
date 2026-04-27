# Публикация на GitHub Pages и подключение домена

## 1. Первый push

```powershell
git add .
git commit -m "Add redesigned Oleganna site"
git push -u origin main
```

## 2. Включить GitHub Pages

1. Откройте репозиторий `MysterVS/OlegAnna` на GitHub.
2. Перейдите в `Settings` -> `Pages`.
3. В блоке `Build and deployment` выберите `Deploy from a branch`.
4. Branch: `main`.
5. Folder: `/root`.
6. Нажмите `Save`.

Через несколько минут сайт будет доступен по адресу:

```text
https://mystervs.github.io/OlegAnna/
```

## 3. Подключить домен oleganna.ru

Файл `CNAME` уже добавлен в репозиторий, в нем указан домен:

```text
oleganna.ru
```

В DNS-зоне домена нужно добавить записи для GitHub Pages.

Для корневого домена `oleganna.ru`:

```text
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

Для `www.oleganna.ru`:

```text
CNAME  www  mystervs.github.io
```

После обновления DNS вернитесь в `Settings` -> `Pages`, укажите `oleganna.ru` в поле `Custom domain` и включите `Enforce HTTPS`, когда GitHub выпустит сертификат.

DNS может обновляться от нескольких минут до 24 часов.

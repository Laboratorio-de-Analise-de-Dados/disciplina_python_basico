import ezgmail


def send_email():
    email = 'guilherme.silveira@fiocruz.br'
    subject = 'EZGmail Test'
    mensagem = 'Olá, este é um teste de envio de email usando a biblioteca EZGmail.'
    text = f'''
    Cabeça 2

    {mensagem}

    Rabo
    '''

    ezgmail.send(email, subject, text)

if __name__ == '__main__':
    send_email()
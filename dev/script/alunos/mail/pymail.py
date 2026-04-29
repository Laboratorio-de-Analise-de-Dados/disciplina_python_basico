import ezgmail as eg
from time import sleep

def send_email_base(
        conta: int,
        email: str = 'guilherme.silveira@fiocruz.br',
        subject: str = 'EZGmail Test',
        mensagem: str = 'Olá, email teste enviado usando a biblioteca EZGmail.'
    ) -> None:
    '''
        Envia um email usando a biblioteca EZGmail.
            Args:
                email (str): O endereço de email do destinatário.
                subject (str): O assunto do email.
                mensagem (str): O corpo do email.
            Returns:
                None: Esta função não retorna nada.
    '''
    text = f'''
    Cabeça
    {conta}
    {mensagem}

    Rabo
    '''
    eg.send(email, subject, text)
    return None

if __name__ == '__main__':
    for i in range(1, 4):
        print(f'Enviando email {i}...')
        send_email_base(conta=i)
        sleep(20)
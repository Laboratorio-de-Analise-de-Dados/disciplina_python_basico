import ezgmail as eg
from time import sleep
import pandas as pd
from joblib import load
import os


def resultado_conceito_teste() -> pd.DataFrame:
    '''
        Cria um DataFrame com os resultados dos alunos.
            Returns:
                pd.DataFrame: Um DataFrame contendo os resultados dos alunos.
    '''
    data = {
        'Nome Aluno': [
                    'Guilherme Silveira',
                    'Jessica Bodart Guimarães',
                    'Felipe Cortez Marcolino',
                    'Metusalen Da Silva'
                ],
        'Frequência Absoluta': [1, 2, 3, 4],
        'Frequência Relativa': [7.14, 14.28, 21.42, 28.56],
        'Nota': [6.79, 7.5, 8.0, 9.0],
        'Conceito': ['D', 'C', 'B', 'A'],
        'E-mail': [
                    'gfsilveira@gmail.com',
                    'jbodartguimaraes@gmail.com',
                    'fecortez.marcolino@gmail.com',
                    'smetusalen@gmail.com'
                ]
    }
    df = pd.DataFrame(data)
    return df


def send_email_base(
        resultados: pd.DataFrame,
        subject: str = 'Conceito Python Basico, T7-2026, 🦥',
        mensagem: str = 'Olá, email teste enviado usando a biblioteca EZGmail.'
    ) -> None:
    '''
        Envia um email usando a biblioteca EZGmail.
            Args:
                resultados (pd.DataFrame): Um DataFrame contendo os resultados dos alunos.
                subject (str): O assunto do email.
                mensagem (str): O corpo do email.
            Returns:
                None: Esta função não retorna nada.
    '''
    nome_aluno = resultados.loc['Nome Aluno'].values[0].split(' ')[0]
    resultados_html = resultados.drop(index='E-mail').to_html()
    email = resultados.loc['E-mail'].values[0]

    mensagem = f'''    
Bom dia {nome_aluno}. Como está?<br><br>

Novamente agradeço pelo seu interesse em nossa disciplina de Python Básico, T7-2026.<br><br>

Segundo o seu desempenho nas atividades e de acordo com as regras do PPGBB, seu conceito foi:<br><br>

{resultados_html}<br><br>

Caso tenha alguma objeção, você têm 24h à partir de agora para responder esse e-mail. Nós analisaremos o recurso e, caso seja procedente, entramos em contato.<br><br>

Após esse prazo, as notas serão enviadas ao PPGBB.<br><br>

Caso você seja aluno externo, entre em contato com o PPGBB para obter a declaração. Esse é forneceido por solicitação, e não é automático.<br><br>

Obrigado.<br><br>

À disposição.<br><br>

Guilherme, 🤖.<br><br>

Guilherme Ferreira Silveira, PhD<br>
Research Scientist<br>
Carlos Chagas Institute - Fiocruz/PR<br>
3775, Prof. Algacyr Munhoz Máder Street<br>
CIC, Curitiba, PR, Brazil<br>
81350-010<br>
SIAPE: 2175165
    '''

    eg.send(
        recipient=email,
        subject=subject,
        body=mensagem,
        mimeSubtype='html'
    )
    return None

if __name__ == '__main__':
    # Importando os dados dos alunos a partir do arquivo salvo
    resultados = load("./../data/df_alunos")

    # Enviando os emails para os alunos
    for i in range(len(resultados)):
        envia = resultados.iloc[i].to_frame()
        send_email_base(resultados=envia)
        sleep(20)
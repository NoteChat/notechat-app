import React, { useContext } from 'react'
import { DialogWindow } from '../dialog'
import { UserContext } from '@renderer/context/user'
import { Link } from 'react-router-dom'
import { SpeakerModerateIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

export interface PackageAlertProps {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export const PackageAlert: React.FC<PackageAlertProps> = ({  }) => {
  const { user } = useContext(UserContext)
  const { t } = useTranslation()
  const { RENDERER_VITE_STRIPE_API_KEY, RENDERER_VITE_STRIPE_TABLE_ID } = import.meta.env;
  return user && (!user.package || user.amount === 0) ? (
    <div className="absolute bottom-0 right-0 h-10 w-full">
      <div className="flex items-center justify-center h-full px-4 color-white gap-2" style={{backgroundColor: 'rgba(239,68,68,.9)'}}>
        <span><SpeakerModerateIcon/> {t('packageExpired.error')}</span>
        <DialogWindow
          title={t('topUp.label')}
          trigger={<Link to={'#'} className='underline' style={{color: 'var(--amber5)'}}>{t('topUp.label')}</Link>}
          description={
            <div>
              <stripe-pricing-table
                pricing-table-id={RENDERER_VITE_STRIPE_TABLE_ID}
                publishable-key={RENDERER_VITE_STRIPE_API_KEY}
                client-reference-id={user.id}
                customer-email={user.email}
                allow-top-navigation
              ></stripe-pricing-table>
            </div>
          }
        />
      </div>
    </div>
  ) : null
}
